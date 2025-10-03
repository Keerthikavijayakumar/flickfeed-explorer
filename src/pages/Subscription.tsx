import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { userService } from '@/lib/userService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap, X } from 'lucide-react';

const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Basic streaming with ads',
    icon: Star,
    features: [
      'Limited content library',
      'SD quality streaming',
      'Ads during playback',
      '1 device at a time',
      'Basic customer support'
    ],
    color: 'bg-gray-500',
    popular: false
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    period: 'month',
    description: 'Ad-free streaming in HD',
    icon: Zap,
    features: [
      'Full content library',
      'HD quality streaming',
      'No ads',
      '2 devices at a time',
      'Priority customer support',
      'Offline downloads (limited)'
    ],
    color: 'bg-blue-500',
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 15.99,
    period: 'month',
    description: 'Ultra HD with premium features',
    icon: Crown,
    features: [
      'Everything in Basic',
      '4K Ultra HD streaming',
      '4 devices at a time',
      'Unlimited offline downloads',
      'Early access to new releases',
      'Premium exclusive content',
      '24/7 priority support'
    ],
    color: 'bg-purple-500',
    popular: true
  },
  {
    id: 'ultra',
    name: 'Ultra',
    price: 24.99,
    period: 'month',
    description: 'Ultimate streaming experience',
    icon: Crown,
    features: [
      'Everything in Premium',
      '8K streaming (where available)',
      'Unlimited devices',
      'Behind-the-scenes content',
      'Director\'s cuts & bonus features',
      'Virtual cinema experiences',
      'Dedicated account manager',
      'Family sharing (up to 6 accounts)'
    ],
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    popular: false
  }
];

export default function Subscription() {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');
  const [loading, setLoading] = useState(false);
  const [isPopup, setIsPopup] = useState(true); // Can be controlled via props/state

  const handleSubscribe = async (planId: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Update user subscription
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription
      
      await userService.updateUser(user.uid, {
        subscription: {
          plan: planId as 'free' | 'basic' | 'premium' | 'ultra',
          status: 'active',
          startDate: new Date(),
          endDate: endDate
        }
      });
      
      // Navigate to browse page
      navigate('/browse');
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('Failed to update subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/browse');
  };

  const handleClose = () => {
    setIsPopup(false);
    navigate('/browse');
  };

  if (!isPopup) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Choose Your Plan</h1>
              <p className="text-lg opacity-90">
                Unlock unlimited streaming with the perfect plan for you
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subscriptionPlans.map((plan) => {
            const IconComponent = plan.icon;
            const isSelected = selectedPlan === plan.id;
            const isCurrentPlan = userData?.subscription?.plan === plan.id;
            
            return (
              <Card
                key={plan.id}
                className={`relative p-6 cursor-pointer transition-all duration-200 ${
                  isSelected ? 'ring-2 ring-primary' : ''
                } ${plan.popular ? 'ring-2 ring-yellow-400' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black">
                    Most Popular
                  </Badge>
                )}
                
                {isCurrentPlan && (
                  <Badge className="absolute -top-3 right-4 bg-green-500 text-white">
                    Current Plan
                  </Badge>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${plan.color} text-white mb-3`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-lg font-normal text-muted-foreground">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={isSelected ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubscribe(plan.id);
                  }}
                  disabled={loading || isCurrentPlan}
                >
                  {loading && selectedPlan === plan.id ? (
                    'Processing...'
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : (
                    `Choose ${plan.name}`
                  )}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Trial Information */}
        <div className="mt-12 text-center">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
            <h3 className="text-xl font-semibold mb-2">🎉 Welcome Bonus!</h3>
            <p className="text-muted-foreground mb-4">
              As a new member, you get a 7-day free trial with any paid plan.
              Cancel anytime during the trial period.
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={handleSkip} variant="outline">
                Continue with Free Plan
              </Button>
              <Button
                onClick={() => handleSubscribe(selectedPlan)}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Start Free Trial'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Features Comparison */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-center mb-8">Compare Plans</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Features</th>
                  {subscriptionPlans.map(plan => (
                    <th key={plan.id} className="text-center p-4">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-medium">Video Quality</td>
                  <td className="text-center p-4">SD</td>
                  <td className="text-center p-4">HD</td>
                  <td className="text-center p-4">4K Ultra HD</td>
                  <td className="text-center p-4">8K</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Simultaneous Devices</td>
                  <td className="text-center p-4">1</td>
                  <td className="text-center p-4">2</td>
                  <td className="text-center p-4">4</td>
                  <td className="text-center p-4">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Ads</td>
                  <td className="text-center p-4">
                    <X className="w-4 h-4 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center p-4">
                    <Check className="w-4 h-4 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center p-4">
                    <Check className="w-4 h-4 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center p-4">
                    <Check className="w-4 h-4 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Offline Downloads</td>
                  <td className="text-center p-4">-</td>
                  <td className="text-center p-4">Limited</td>
                  <td className="text-center p-4">Unlimited</td>
                  <td className="text-center p-4">Unlimited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


