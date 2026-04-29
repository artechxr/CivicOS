export interface KnowledgeResponse {
  intent: string;
  explanation: string;
  steps: string[];
  tips: string[];
  category: 'voting' | 'registration' | 'documents' | 'process' | 'security' | 'general' | 'politics';
  relatedIntents?: string[]; // Used for Smart Suggestions
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export const knowledgeBase: Record<string, KnowledgeResponse> = {
  voting_process: {
    intent: 'voting_process',
    category: 'voting',
    explanation: 'Voting in India is a transparent and secure process conducted via Electronic Voting Machines (EVMs) and VVPAT printers.',
    steps: [
      'Enter the polling booth and find your name in the electoral roll.',
      'The first official checks your ID and your name on the list.',
      'The second official inks your finger and gives you a voter slip.',
      'Go to the voting compartment and press the blue button on the EVM next to your candidate\'s symbol.',
      'Verify your vote on the VVPAT screen (it displays the slip for 7 seconds).'
    ],
    tips: [
      'Ensure the beep sound is heard after pressing the button.',
      'Do not carry mobile phones or cameras inside the voting compartment.',
      'You can ask the Presiding Officer for help if you are confused about the machine.'
    ],
    relatedIntents: ['documents', 'election_day', 'common_mistakes']
  },
  registration: {
    intent: 'registration',
    category: 'registration',
    explanation: 'Registering as a voter is the first step toward participating in democracy. Any citizen above 18 can apply.',
    steps: [
      'Visit the National Voter\'s Service Portal (voters.eci.gov.in).',
      'Fill out Form 6 for fresh registration as a general voter.',
      'Upload proof of age (Aadhaar/PAN) and proof of residence.',
      'Submit the form and track your application status using the reference ID.',
      'A Booth Level Officer (BLO) will visit for physical verification.'
    ],
    tips: [
      'The deadline for registration is usually 3 weeks before the election date.',
      'Keep your digital photo ready in JPG format before starting the form.'
    ],
    relatedIntents: ['documents', 'voting_process']
  },
  documents: {
    intent: 'documents',
    category: 'documents',
    explanation: 'To cast your vote, you must prove your identity at the polling station.',
    steps: [
      'The primary document is your Voter ID (EPIC Card).',
      'If you don\'t have a Voter ID, you can use any of 12 alternative documents.',
      'Accepted alternatives include Aadhaar Card, PAN Card, and Driving License.',
      'MNREGA Job Card and Passbooks with photos are also accepted.',
      'Smart Cards issued by RGI under NPR or Pension documents with photos work too.'
    ],
    tips: [
      'Your name MUST be in the electoral roll, even if you have a Voter ID.',
      'Carry the original document, not a photocopy.'
    ],
    relatedIntents: ['voting_process', 'registration', 'common_mistakes']
  },
  timeline: {
    intent: 'timeline',
    category: 'process',
    explanation: 'Elections in India are usually conducted in multiple phases over several weeks to ensure security and fair voting.',
    steps: [
      'Announcement of Dates: The Election Commission releases the schedule.',
      'Filing Nominations: Candidates file their papers.',
      'Scrutiny: Officials verify candidate details.',
      'Campaigning: Parties share their manifestos.',
      'Polling Day: Citizens cast their votes phase-wise.',
      'Counting Day: Results are announced.'
    ],
    tips: [
      'Check your specific constituency\'s phase on the ECI website or Voter Helpline app.',
      'Campaigning stops 48 hours before the poll closes in your area.'
    ],
    relatedIntents: ['types_of_elections', 'political_parties']
  },
  types_of_elections: {
    intent: 'types_of_elections',
    category: 'general',
    explanation: 'India is a federal parliamentary representative democratic republic with multiple levels of elections.',
    steps: [
      'Lok Sabha (General): Elections to elect Members of Parliament (MPs) to the central government.',
      'Vidhan Sabha (State): Elections to elect Members of Legislative Assembly (MLAs) for the state government.',
      'Rajya Sabha: Indirect elections to the upper house of Parliament.',
      'Local Body: Elections for Municipal Corporations, Municipalities, and Panchayats.'
    ],
    tips: [
      'General Elections (Lok Sabha) happen every 5 years.',
      'State elections happen at different times based on the state assembly term.'
    ],
    relatedIntents: ['timeline', 'political_parties']
  },
  political_parties: {
    intent: 'political_parties',
    category: 'politics',
    explanation: 'In India, political parties are classified into National and State parties based on their vote share and representation. The system allows multiple parties to compete, ensuring diverse representation.',
    steps: [
      'National Parties: Parties that secure a significant percentage of votes across multiple states (e.g., BJP, INC, AAP, BSP, CPI-M).',
      'State Parties: Regional parties dominant in specific states, focusing on local issues (e.g., DMK, TMC, YSRCP).',
      'Ideologies: Parties range from center-right (focusing on cultural nationalism and economic growth) to center-left (focusing on secularism and welfare) and regionalism.',
      'Manifestos: Before elections, parties release documents promising specific actions (like infrastructure, subsidies, or jobs).'
    ],
    tips: [
      'Evaluate a party based on their past performance in governance rather than just speeches.',
      'Read the manifestos carefully to see which party aligns with your priorities.'
    ],
    relatedIntents: ['candidate_choice', 'types_of_elections', 'timeline']
  },
  candidate_choice: {
    intent: 'candidate_choice',
    category: 'politics',
    explanation: 'Comparing candidates helps you make an informed decision. Look at their background, education, and promises.',
    steps: [
      'Check the official "Know Your Candidate" (KYC) app by the ECI for criminal records.',
      'Review their educational and professional background.',
      'Look at their attendance and questions asked if they were an MP/MLA previously.',
      'Compare their specific promises for your constituency.'
    ],
    tips: [
      'Here is an example of how to compare candidates objectively:',
      'Do not vote based on external pressure or unverified social media claims.'
    ],
    relatedIntents: ['political_parties', 'fake_news'],
    table: {
      headers: ['Criteria', 'Candidate A', 'Candidate B'],
      rows: [
        ['Background', 'Local business leader', 'Social worker'],
        ['Education', 'B.Com (Finance)', 'MA (Sociology)'],
        ['Key Focus', 'Infrastructure, Jobs', 'Healthcare, Education'],
        ['Experience', '2 terms as MLA', 'New candidate'],
        ['Criminal Records', 'None declared', 'None declared']
      ]
    }
  },
  fake_news: {
    intent: 'fake_news',
    category: 'security',
    explanation: 'Misinformation can disrupt the democratic process. Stay alert and verify before you share anything.',
    steps: [
      'Check the source of the news. Is it a verified news outlet or an official ECI handle?',
      'Look for the "Forwarded many times" label on WhatsApp; these are high-risk.',
      'Verify dates and claims on the ECI official "Myth vs Reality" register.',
      'Use Google reverse image search for suspicious photos or videos.',
      'Cross-check controversial statements on established fact-checking sites like Alt News or Boom Live.'
    ],
    tips: [
      'Deepfake videos are on the rise; look for unnatural lip movements or generic backgrounds.',
      'Rumors about "online voting from home" or "free public holidays" are ALWAYS fake. Voting is in-person only.'
    ],
    relatedIntents: ['common_mistakes', 'candidate_choice']
  },
  election_day: {
    intent: 'election_day',
    category: 'process',
    explanation: 'Election day is a public holiday in most constituencies to allow everyone the opportunity to vote.',
    steps: [
      'Locate your booth in advance using the Voter Helpline App.',
      'Arrive early to avoid long queues (Polls usually start at 7 AM).',
      'Carry your primary identification and your Voter Slip (if you received one).',
      'Maintain silence and follow the queue system.',
      'Collect your inked finger mark as a badge of pride!'
    ],
    tips: [
      'Mobile phones are strictly prohibited inside the voting booth.',
      'Senior citizens, pregnant women, and persons with disabilities have priority access.'
    ],
    relatedIntents: ['voting_process', 'documents', 'common_mistakes']
  },
  common_mistakes: {
    intent: 'common_mistakes',
    category: 'security',
    explanation: 'Small errors can sometimes lead to your vote not being cast or your entry being delayed. Avoid these common pitfalls.',
    steps: [
      'Not verifying your name in the electoral roll before reaching the booth. (Having an EPIC card is not enough!)',
      'Forgetting to carry an original valid photo ID.',
      'Going to the wrong polling station (booth locations can change).',
      'Touching the EVM before the official enables it.',
      'Arriving after the poll closing time (usually 6 PM).'
    ],
    tips: [
      'If you reach the booth before 6 PM and join the queue, you ARE legally allowed to vote, even if it gets late.',
      'Do not wear party symbols or colors near the polling booth.'
    ],
    relatedIntents: ['documents', 'election_day', 'fake_news']
  }
};
