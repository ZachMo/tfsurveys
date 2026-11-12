// Live Poll settings. Edit this file, then commit and push.
window.POLL_CONFIG = {
  // From Supabase: Project Settings > API. Leave both blank to run in demo mode.
  supabaseUrl: "https://digmbupopvskkwwijktc.supabase.co",      // like "https://abcdefgh.supabase.co"
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ21idXBvcHZza2t3d2lqa3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ0NTA4MjQsImV4cCI6MjExMDAyNjgyNH0.p1q57Z6qNCSehXlxEIudwGeaIx5hJupCiGPtsCDHYK4",  // the "anon public" key (safe to put in a web page)

  // The address in the QR code. Blank = the folder this page is served from.
  voteUrl: "https://tfsurveys.com",

  title: "Navigator Forum Live Poll",
  logo: "navigator-forum-logo.png",

  // Your questions, in slide order. Up to 12 choices each.
  // After you change the questions, clear the old results in admin.html.
  questions: [
    {
      text: "What Is Your Current Technology State?",
      choices: ["Minimal", "Basic", "Proficient", "Advanced", "Maximalist"]
    },
    {
      text: "How Frequently Do You Log Into Routefinder PLUS?",
      choices: ["Daily", "Often", "Sometimes", "Rarely", "Never"]
    },
    {
      text: "What Matters Most on Your Roadmap?",
      choices: ["GPS Tracking", "Parent App", "Tablet Navigation", "Student Ridership", "Other"]
    },
    {
      text: "Who Drives Technology Demand at Your District?",
      choices: ["Transportation", "Drivers", "Parents", "Schools and Admin", "IT"]
    },
    {
      text: "One Thing You'd Most Like to Improve?",
      choices: ["Route Efficiency & Planning", "Real-Time Visibility", "Driver Tools and Execution", "Parent & District Communication", "Making Data-Driven Decisions"]
    }
  ]
};
