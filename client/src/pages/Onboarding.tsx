
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  User,
  GraduationCap,
  Target,
  BookOpen,
  Clock,
  Trophy,
  Sparkles
} from 'lucide-react';

interface OnboardingData {
  personalInfo: {
    firstName: string;
    lastName: string;
    age: string;
    state: string;
  };
  academicLevel: {
    currentClass: string;
    school: string;
    examGoals: string[];
  };
  learningGoals: {
    primaryGoal: string;
    subjects: string[];
    weakAreas: string[];
  };
  studyPreferences: {
    studyTime: string;
    difficultyLevel: string;
    learningStyle: string;
  };
  schedule: {
    availableDays: string[];
    preferredTime: string;
    sessionDuration: string;
  };
  motivation: {
    motivationType: string;
    targetScore: string;
    timeline: string;
  };
  aiPersonalization: {
    teacherPreference: string;
    communicationStyle: string;
    reminderFrequency: string;
  };
}

const initialData: OnboardingData = {
  personalInfo: { firstName: '', lastName: '', age: '', state: '' },
  academicLevel: { currentClass: '', school: '', examGoals: [] },
  learningGoals: { primaryGoal: '', subjects: [], weakAreas: [] },
  studyPreferences: { studyTime: '', difficultyLevel: '', learningStyle: '' },
  schedule: { availableDays: [], preferredTime: '', sessionDuration: '' },
  motivation: { motivationType: '', targetScore: '', timeline: '' },
  aiPersonalization: { teacherPreference: '', communicationStyle: '', reminderFrequency: '' }
};

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
  'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano',
  'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const academicLevels = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3', 'Post-Secondary'];
const examGoals = ['WAEC', 'NECO', 'JAMB', 'POST-UTME', 'NABTEB', 'GCE'];
const coreSubjects = [
  'Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology',
  'Government', 'Economics', 'Literature', 'Geography', 'History',
  'Agricultural Science', 'Commerce', 'Accounting', 'Computer Studies'
];

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;

  const updateData = (section: keyof OnboardingData, updates: any) => {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  };

  const toggleArrayItem = (section: keyof OnboardingData, field: string, item: string) => {
    setData(prev => {
      const currentArray = (prev[section] as any)[field] || [];
      const newArray = currentArray.includes(item)
        ? currentArray.filter((i: string) => i !== item)
        : [...currentArray, item];
      
      return {
        ...prev,
        [section]: { ...prev[section], [field]: newArray }
      };
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      // Save onboarding data to user profile
      await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`
        },
        body: JSON.stringify({
          onboardingData: data,
          onboardingCompleted: true,
          plan: 'freemium' // Start with freemium plan
        })
      });

      toast({
        title: 'Welcome to EduQuest! 🎉',
        description: 'Your learning journey starts now. Let\'s achieve your goals together!',
      });

      navigate('/app/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete onboarding. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Tell us about yourself</CardTitle>
              <p className="text-gray-600">Let's get to know you better so we can personalize your experience</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={data.personalInfo.firstName}
                    onChange={(e) => updateData('personalInfo', { firstName: e.target.value })}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={data.personalInfo.lastName}
                    onChange={(e) => updateData('personalInfo', { lastName: e.target.value })}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={data.personalInfo.age}
                    onChange={(e) => updateData('personalInfo', { age: e.target.value })}
                    placeholder="Your age"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State of Origin</Label>
                  <select
                    id="state"
                    value={data.personalInfo.state}
                    onChange={(e) => updateData('personalInfo', { state: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your state</option>
                    {nigerianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Academic Information</CardTitle>
              <p className="text-gray-600">Help us understand your current academic level</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentClass">Current Class/Level</Label>
                <select
                  id="currentClass"
                  value={data.academicLevel.currentClass}
                  onChange={(e) => updateData('academicLevel', { currentClass: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your class</option>
                  {academicLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="school">School Name (Optional)</Label>
                <Input
                  id="school"
                  value={data.academicLevel.school}
                  onChange={(e) => updateData('academicLevel', { school: e.target.value })}
                  placeholder="Enter your school name"
                />
              </div>

              <div>
                <Label>Exam Goals (Select all that apply)</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {examGoals.map(exam => (
                    <Button
                      key={exam}
                      variant={data.academicLevel.examGoals.includes(exam) ? "default" : "outline"}
                      onClick={() => toggleArrayItem('academicLevel', 'examGoals', exam)}
                      className="h-auto py-2"
                    >
                      {exam}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Learning Goals</CardTitle>
              <p className="text-gray-600">What do you want to achieve with EduQuest?</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Primary Learning Goal</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    'Improve grades', 'Exam preparation', 'Build confidence',
                    'Master difficult subjects', 'General knowledge', 'Competitive exams'
                  ].map(goal => (
                    <Button
                      key={goal}
                      variant={data.learningGoals.primaryGoal === goal ? "default" : "outline"}
                      onClick={() => updateData('learningGoals', { primaryGoal: goal })}
                      className="h-auto py-2 text-sm"
                    >
                      {goal}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Subjects of Interest</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                  {coreSubjects.map(subject => (
                    <Button
                      key={subject}
                      variant={data.learningGoals.subjects.includes(subject) ? "default" : "outline"}
                      onClick={() => toggleArrayItem('learningGoals', 'subjects', subject)}
                      className="h-auto py-2 text-sm"
                    >
                      {subject}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Areas you find challenging (Optional)</Label>
                <Textarea
                  value={data.learningGoals.weakAreas.join(', ')}
                  onChange={(e) => updateData('learningGoals', { weakAreas: e.target.value.split(', ').filter(Boolean) })}
                  placeholder="e.g., Algebra, Essay Writing, Chemical Equations..."
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Study Preferences</CardTitle>
              <p className="text-gray-600">How do you prefer to learn?</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Preferred Study Time</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Early morning', 'Morning', 'Afternoon', 'Evening', 'Night', 'Flexible'].map(time => (
                    <Button
                      key={time}
                      variant={data.studyPreferences.studyTime === time ? "default" : "outline"}
                      onClick={() => updateData('studyPreferences', { studyTime: time })}
                      className="h-auto py-2"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Difficulty Level Preference</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                    <Button
                      key={level}
                      variant={data.studyPreferences.difficultyLevel === level ? "default" : "outline"}
                      onClick={() => updateData('studyPreferences', { difficultyLevel: level })}
                      className="h-auto py-2"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Learning Style</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    'Visual (diagrams, charts)', 'Text-based explanations',
                    'Step-by-step guidance', 'Practice-heavy approach'
                  ].map(style => (
                    <Button
                      key={style}
                      variant={data.studyPreferences.learningStyle === style ? "default" : "outline"}
                      onClick={() => updateData('studyPreferences', { learningStyle: style })}
                      className="h-auto py-2 text-sm"
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Study Schedule</CardTitle>
              <p className="text-gray-600">When can you commit to studying?</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Available Days</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <Button
                      key={day}
                      variant={data.schedule.availableDays.includes(day) ? "default" : "outline"}
                      onClick={() => toggleArrayItem('schedule', 'availableDays', day)}
                      className="h-auto py-2 text-sm"
                    >
                      {day.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Preferred Time Slot</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    '6:00 AM - 8:00 AM', '8:00 AM - 12:00 PM',
                    '12:00 PM - 4:00 PM', '4:00 PM - 8:00 PM',
                    '8:00 PM - 10:00 PM', 'Flexible timing'
                  ].map(slot => (
                    <Button
                      key={slot}
                      variant={data.schedule.preferredTime === slot ? "default" : "outline"}
                      onClick={() => updateData('schedule', { preferredTime: slot })}
                      className="h-auto py-2 text-sm"
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Study Session Duration</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['15-30 minutes', '30-60 minutes', '1-2 hours'].map(duration => (
                    <Button
                      key={duration}
                      variant={data.schedule.sessionDuration === duration ? "default" : "outline"}
                      onClick={() => updateData('schedule', { sessionDuration: duration })}
                      className="h-auto py-2"
                    >
                      {duration}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Motivation & Goals</CardTitle>
              <p className="text-gray-600">What drives you to succeed?</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>What motivates you most?</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    'Getting good grades', 'University admission',
                    'Making parents proud', 'Personal achievement',
                    'Career goals', 'Proving myself'
                  ].map(motivation => (
                    <Button
                      key={motivation}
                      variant={data.motivation.motivationType === motivation ? "default" : "outline"}
                      onClick={() => updateData('motivation', { motivationType: motivation })}
                      className="h-auto py-2 text-sm"
                    >
                      {motivation}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Target Score/Grade (if applicable)</Label>
                <Input
                  value={data.motivation.targetScore}
                  onChange={(e) => updateData('motivation', { targetScore: e.target.value })}
                  placeholder="e.g., A1 in Mathematics, 250+ in JAMB"
                />
              </div>

              <div>
                <Label>Timeline for achieving your goal</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    'Next term', 'This academic year',
                    'Next academic year', 'In 2 years',
                    'Long-term goal', 'Continuous improvement'
                  ].map(timeline => (
                    <Button
                      key={timeline}
                      variant={data.motivation.timeline === timeline ? "default" : "outline"}
                      onClick={() => updateData('motivation', { timeline: timeline })}
                      className="h-auto py-2 text-sm"
                    >
                      {timeline}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 7:
        return (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">AI Personalization</CardTitle>
              <p className="text-gray-600">Customize your AI learning assistant</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Preferred AI Teacher</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Button
                    variant={data.aiPersonalization.teacherPreference === 'Kingsley' ? "default" : "outline"}
                    onClick={() => updateData('aiPersonalization', { teacherPreference: 'Kingsley' })}
                    className="h-auto py-4 flex flex-col items-center space-y-2"
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">K</span>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Kingsley</div>
                      <div className="text-xs text-gray-600">Encouraging & Supportive</div>
                    </div>
                  </Button>
                  <Button
                    variant={data.aiPersonalization.teacherPreference === 'Rita' ? "default" : "outline"}
                    onClick={() => updateData('aiPersonalization', { teacherPreference: 'Rita' })}
                    className="h-auto py-4 flex flex-col items-center space-y-2"
                  >
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">R</span>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Rita</div>
                      <div className="text-xs text-gray-600">Direct & Challenging</div>
                    </div>
                  </Button>
                </div>
              </div>

              <div>
                <Label>Communication Style</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    'Formal & structured', 'Casual & friendly',
                    'Motivational', 'Straightforward'
                  ].map(style => (
                    <Button
                      key={style}
                      variant={data.aiPersonalization.communicationStyle === style ? "default" : "outline"}
                      onClick={() => updateData('aiPersonalization', { communicationStyle: style })}
                      className="h-auto py-2 text-sm"
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Reminder Frequency</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['Daily', 'Every few days', 'Weekly', 'None'].map(freq => (
                    <Button
                      key={freq}
                      variant={data.aiPersonalization.reminderFrequency === freq ? "default" : "outline"}
                      onClick={() => updateData('aiPersonalization', { reminderFrequency: freq })}
                      className="h-auto py-2"
                    >
                      {freq}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome to EduQuest! 🎓
          </h1>
          <p className="text-gray-600">Let's personalize your learning experience</p>
          
          {/* Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i + 1 <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentStep === totalSteps ? (
            <Button
              onClick={completeOnboarding}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Completing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete Setup</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
