import { Component } from '@angular/core';

@Component({
  selector: 'app-plans',
  imports: [],
  templateUrl: './plans.html',
})
export class Plans {
    plans = [
    {
      name: 'Free',
      subtitle: 'Individuals & very small teams',
      price: 'Free',
      billing: 'Up to 5 users',
      buttonText: 'Get Started',
      buttonClass: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      featured: false,
      features: [
        '5 projects',
        '500 task limit',
        '100 MB storage',
        'Community support',
      ],
    },
    {
      name: 'Basic',
      subtitle: 'For growing teams',
      price: '€7',
      billing: '/user/month',
      buttonText: 'Choose Basic',
      buttonClass: 'bg-[#191933] text-white hover:bg-[#101024]',
      featured: false,
      features: [
        'Everything in Free, plus:',
        'Unlimited projects & tasks',
        '10 GB storage',
        'Email support',
        'Subtasks & templates',
        'Advanced task management',
        'Google Calendar integration',
      ],
    },
    {
      name: 'Pro',
      subtitle: 'Established businesses & power users',
      price: '€12',
      billing: '/user/month',
      buttonText: 'Choose Pro',
      buttonClass: 'bg-[#8f4ac9] text-white hover:bg-[#7e39ba]',
      featured: true,
      features: [
        'Everything in Basic, plus:',
        '100 GB storage',
        'Priority support via Chat & Email',
        'Advanced analytics & export',
        'Unlimited automations',
        'Up to 50 users/video call',
        'Advanced admin controls',
        'Custom roles & groups',
      ],
    },
  ];

  comparisonRows = [
    { label: 'Users', free: 'Up to 5', basic: 'Unlimited', pro: 'Unlimited' },
    { label: 'Projects', free: '5 projects', basic: 'Unlimited', pro: 'Unlimited' },
    { label: 'Tasks', free: '500 limit', basic: 'Unlimited', pro: 'Unlimited' },
    { label: 'File Storage', free: '100 MB', basic: '10 GB', pro: '100 GB' },
    { label: 'Support', free: 'Community', basic: 'Email Support', pro: 'Priority Support' },
  ];

  generalFeatures = [
    { label: 'Languages', value: 'English, French, Spanish, Swahili, Wolof' },
    { label: 'Mobile Apps (iOS & Android)', value: 'Coming Soon' },
    { label: 'Project API', value: 'Coming Soon' },
  ];
}
