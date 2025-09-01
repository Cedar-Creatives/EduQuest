
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedCard, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/enhanced-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  TrophyIcon,
  SparklesIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    setIsLoading(true);
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
    setIsLoading(false);
  };

  const features = [
    {
      icon: AcademicCapIcon,
      title: 'WAEC, NECO & JAMB Prep',
      description: 'Comprehensive preparation materials for all major Nigerian exams with past questions and solutions.',
      color: 'text-primary-blue-600'
    },
    {
      icon: SparklesIcon,
      title: 'AI-Powered Learning',
      description: 'Meet Kingsley & Rita, your personal AI teachers who adapt to your learning style and pace.',
      color: 'text-success-green-600'
    },
    {
      icon: BookOpenIcon,
      title: 'Rich Study Materials',
      description: 'Access thousands of notes, summaries, and practice materials for JS1-SS3 curriculum.',
      color: 'text-primary-blue-600'
    },
    {
      icon: ChartBarIcon,
      title: 'Progress Tracking',
      description: 'Monitor your learning progress with detailed analytics and personalized recommendations.',
      color: 'text-success-green-600'
    }
  ];

  const examTypes = [
    { name: 'WAEC', description: 'West African Examinations Council', students: '2M+' },
    { name: 'NECO', description: 'National Examinations Council', students: '1.5M+' },
    { name: 'JAMB', description: 'Joint Admissions and Matriculation Board', students: '1.8M+' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-blue-50">
      {/* Header */}
      <header className="relative z-20 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-blue-600 to-success-green-600 rounded-xl flex items-center justify-center">
              <AcademicCapIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">EduQuest</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-primary-blue-600 hover:bg-primary-blue-700"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-primary-blue-600 hover:bg-primary-blue-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-success-green-100 text-success-green-800 border-success-green-200">
              🇳🇬 Made for Nigerian Students
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Ace Your Exams with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-blue-600 to-success-green-600 block mt-2">
                AI-Powered Learning
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of Nigerian students preparing for WAEC, NECO, and JAMB with personalized AI tutors, 
              comprehensive study materials, and smart practice quizzes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                disabled={isLoading}
                className="bg-primary-blue-600 hover:bg-primary-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl min-w-[200px]"
              >
                {isLoading ? 'Loading...' : 'Start Learning Free'}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/quiz')}
                className="border-primary-blue-300 text-primary-blue-600 hover:bg-primary-blue-50 px-8 py-4 text-lg font-semibold rounded-xl min-w-[200px]"
              >
                Try Demo Quiz
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-blue-600">50k+</div>
                <div className="text-sm text-gray-600">Practice Questions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-success-green-600">15k+</div>
                <div className="text-sm text-gray-600">Students Helped</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-blue-600">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Types Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Prepare for All Major Nigerian Exams
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive preparation materials tailored for each exam type
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {examTypes.map((exam, index) => (
              <EnhancedCard 
                key={exam.name} 
                variant="interactive" 
                hover 
                className="text-center"
                onClick={() => navigate('/register')}
              >
                <CardHeader>
                  <CardTitle size="lg" className="text-primary-blue-600">
                    {exam.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {exam.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success-green-600 mb-2">
                    {exam.students}
                  </div>
                  <div className="text-sm text-gray-500">
                    Students annually
                  </div>
                </CardContent>
              </EnhancedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Students Choose EduQuest
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced learning tools designed specifically for Nigerian curriculum and exam requirements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <EnhancedCard key={index} variant="default" className="group">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className={cn(
                      'p-3 rounded-xl transition-colors duration-200',
                      'bg-gray-100 group-hover:bg-primary-blue-100'
                    )}>
                      <feature.icon className={cn('w-6 h-6', feature.color)} />
                    </div>
                    <div>
                      <CardTitle size="md">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </EnhancedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-blue-600 to-success-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Boost Your Exam Scores?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful students who achieved their academic goals with EduQuest
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-white text-primary-blue-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              {isLoading ? 'Loading...' : 'Start Your Journey'}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-blue-600 to-success-green-600 rounded-lg flex items-center justify-center">
              <AcademicCapIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">EduQuest</h3>
          </div>
          
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Empowering Nigerian students to achieve academic excellence through innovative AI-powered learning solutions.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            © 2024 EduQuest. Made with ❤️ for Nigerian students.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
