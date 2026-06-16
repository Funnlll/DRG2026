/**
 * Fixed Field Trip itinerary information (not editable)
 */
export const FIELD_TRIP_INFO = {
  name: 'Field Trip',
  date: 'July 8, 2026 (Wednesday)',
  assembly_location: 'The shuttle bus at the south gate of the school',
  departure_time: '09:00',
  schedule: [
    { time: '09:00', activity: 'Gather at the south gate of the school, board the shuttle bus' },
    { time: '09:00–12:00', activity: 'Activity: Shawan Ancient Town + Yuyin Garden' },
    { time: '12:00–13:30', activity: 'Activity: Lunch' },
    { time: '13:30–17:00', activity: 'Activity: Guangzhou Urban Planning Exhibition Center + Urban/Architectural Model Museum' },
    { time: '17:00', activity: 'Gather and return to school' },
  ],
  lunch: 'Group lunch at a local restaurant with authentic Cantonese cuisine. Dietary restrictions have been collected during registration.',
  return_time: '17:00',
  notes: [
    'Please wear school uniform and bring your student ID card',
    'Bring a lightweight backpack, water bottle, and notebook',
    'No valuable items or large amounts of cash allowed',
    'Keep mobile phones on silent and follow teacher instructions',
  ],
  contact: {
    teacher: 'Mr. Wang',
    phone: '+86 138-0000-0000',
    backup: 'Ms. Li +86 139-0000-0000',
  },
  attractions: [
    {
      id: 1,
      name: 'Shawan Ancient Town',
      description: 'Historic Lingnan water town with traditional architecture, ancestral halls, and cultural heritage',
      image: '/shawan.jpg',
    },
    {
      id: 2,
      name: 'Yuyin Garden',
      description: 'One of the four famous gardens of Lingnan, featuring exquisite pavilions and tranquil scenery',
      image: '/yuyin.jpg',
    },
    {
      id: 3,
      name: 'Guangzhou Urban Planning Exhibition Center',
      description: 'Modern exhibition center showcasing Guangzhou\'s urban development and future planning',
      image: '/planning.jpg',
    },
    {
      id: 4,
      name: 'Urban/Architectural Model Museum',
      description: 'Museum featuring architectural models and urban design exhibitions from renowned projects',
      image: '/model.jpg',
    },
  ],
}
