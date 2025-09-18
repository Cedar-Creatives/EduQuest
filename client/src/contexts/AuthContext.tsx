import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'

interface User {
  uid: string
  email: string
  username: string
  role: string
  plan: string
}

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  loginWithGoogle: () => Promise<{ success: boolean; message?: string }>
  register: (email: string, password: string, username: string) => Promise<{ success: boolean; message?: string }>
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Helper function to handle Google user creation
  const handleGoogleUserCreation = async (userCredential: any) => {
    // Check if user exists in Firestore, if not create them
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
    if (!userDoc.exists()) {
      console.log('Creating new user document for Google user')
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        username: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'User',
        role: 'user',
        plan: 'freemium',
        subscriptionState: 'active',
        dailyQuizLimit: 3,
        dailyQuizzesTaken: 0,
        lastQuizResetDate: new Date(),
        completedQuizzes: [],
        totalQuizzes: 0,
        averageScore: 0,
        studyStreak: 0,
        lastStudyDate: null,
        achievements: 0,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        isActive: true
      }
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData)
      console.log('New user document created for Google user')
    }
  }

  useEffect(() => {
    console.log('=== AUTH CONTEXT INITIALIZATION ===')
    
    // Check for redirect result first
    getRedirectResult(auth).then(async (result) => {
      if (result) {
        console.log('Google redirect sign in successful:', result.user.uid)
        await handleGoogleUserCreation(result)
      }
    }).catch((error) => {
      console.error('Redirect result error:', error)
    })
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Firebase auth state changed:', firebaseUser ? firebaseUser.uid : 'null')
      
      if (firebaseUser) {
        setFirebaseUser(firebaseUser)
        setIsAuthenticated(true)
        
        // Get user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUser({
              uid: userData.uid,
              email: userData.email,
              username: userData.username,
              role: userData.role,
              plan: userData.plan || userData.subscriptionStatus || 'freemium'
            })
            console.log('User data loaded from Firestore:', userData.username)
          } else {
            console.error('User document not found in Firestore for UID:', firebaseUser.uid)
            // Handle missing user document - sign out the user
            console.log('Signing out user due to missing Firestore document')
            await signOut(auth)
            return
          }
        } catch (error) {
          console.error('Error loading user data:', error)
          // Handle Firestore error - sign out the user
          console.log('Signing out user due to Firestore error')
          await signOut(auth)
          return
        }
      } else {
        setFirebaseUser(null)
        setUser(null)
        setIsAuthenticated(false)
        console.log('User signed out')
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    console.log('=== AUTH CONTEXT LOGIN START ===')
    console.log('Login attempt for email:', email)
    
    try {
      console.log('Signing in with Firebase...')
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('Firebase sign in successful:', userCredential.user.uid)
      
      // User data will be loaded in the onAuthStateChanged listener
      console.log('=== AUTH CONTEXT LOGIN SUCCESS ===')
      return { success: true }
    } catch (error: any) {
      console.error('=== AUTH CONTEXT LOGIN ERROR ===')
      console.error('Error in login function:', error)
      
      let errorMessage = 'Login failed'
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found. Please check your email or create an account.'
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid password. Please try again.'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address. Please enter a valid email.'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.'
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid credentials. Please check your email and password.'
      }
      
      return { 
        success: false, 
        message: errorMessage
      }
    }
  }

  const loginWithGoogle = async () => {
    console.log('=== AUTH CONTEXT GOOGLE LOGIN START ===')
    
    // Debug current domain
    const currentDomain = window.location.hostname
    const currentOrigin = window.location.origin
    console.log('Current domain:', currentDomain)
    console.log('Current origin:', currentOrigin)
    console.log('Make sure these are authorized in Firebase Console and Google Cloud Console')
    
    try {
      const provider = new GoogleAuthProvider()
      console.log('Signing in with Google...')
      
      // For now, let's just use popup and handle the specific error
      const userCredential = await signInWithPopup(auth, provider)
      console.log('Google sign in successful:', userCredential.user.uid)
      
      // Handle user creation logic here
      await handleGoogleUserCreation(userCredential)
      console.log('=== AUTH CONTEXT GOOGLE LOGIN SUCCESS ===')
      return { success: true }

    } catch (error: any) {
      console.error('=== AUTH CONTEXT GOOGLE LOGIN ERROR ===')
      console.error('Error in Google login function:', error)
      
      let errorMessage = 'Google login failed'
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Login cancelled'
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup blocked. Please allow popups for this site.'
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again. If the issue persists, the domain may need to be authorized in Firebase.'
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for Google sign-in. Please contact support.'
      }
      
      return { 
        success: false, 
        message: errorMessage
      }
    }
  }

  const register = async (email: string, password: string, username: string) => {
    console.log('=== AUTH CONTEXT REGISTER START ===')
    console.log('Register attempt for email:', email, 'username:', username)
    
    try {
      console.log('Creating user with Firebase...')
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log('Firebase user created:', userCredential.user.uid)
      
      // Create user document in Firestore
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        username: username || email.split('@')[0],
        role: 'user',
        plan: 'freemium',
        subscriptionState: 'active',
        dailyQuizLimit: 3,
        dailyQuizzesTaken: 0,
        lastQuizResetDate: new Date(),
        completedQuizzes: [],
        totalQuizzes: 0,
        averageScore: 0,
        studyStreak: 0,
        lastStudyDate: null,
        achievements: 0,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        isActive: true
      }
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData)
      console.log('User document created in Firestore')
      
      // User data will be loaded in the onAuthStateChanged listener
      console.log('=== AUTH CONTEXT REGISTER SUCCESS ===')
      return { success: true }
    } catch (error: any) {
      console.error('=== AUTH CONTEXT REGISTER ERROR ===')
      console.error('Error in register function:', error)
      
      let errorMessage = 'Registration failed'
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already exists'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak'
      }
      
      return { 
        success: false, 
        message: errorMessage
      }
    }
  }

  const resetPassword = async (email: string) => {
    console.log('=== AUTH CONTEXT RESET PASSWORD START ===')
    console.log('Reset password attempt for email:', email)
    
    try {
      await sendPasswordResetEmail(auth, email)
      console.log('=== AUTH CONTEXT RESET PASSWORD SUCCESS ===')
      return { success: true, message: 'Password reset email sent. Please check your inbox.' }
    } catch (error: any) {
      console.error('=== AUTH CONTEXT RESET PASSWORD ERROR ===')
      console.error('Error in resetPassword function:', error)
      
      let errorMessage = 'Failed to send password reset email'
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address. Please enter a valid email.'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.'
      }
      
      return { 
        success: false, 
        message: errorMessage
      }
    }
  }

  const logout = () => {
    console.log('=== AUTH CONTEXT LOGOUT ===')
    console.log('Signing out from Firebase...')
    
    signOut(auth).then(() => {
      console.log('Firebase sign out successful')
    }).catch((error) => {
      console.error('Error signing out:', error)
    })
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      firebaseUser,
      login, 
      loginWithGoogle,
      register, 
      resetPassword,
      logout, 
      isAuthenticated,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}