// Live Poll settings. Edit this file, then upload the folder again.
window.POLL_CONFIG = {
  // From Supabase: Project Settings > API. Leave both blank to run in demo mode.
  supabaseUrl: "https://digmbupopvskkwwijktc.supabase.co",      // like "https://abcdefgh.supabase.co"
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ21idXBvcHZza2t3d2lqa3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ0NTA4MjQsImV4cCI6MjExMDAyNjgyNH0.p1q57Z6qNCSehXlxEIudwGeaIx5hJupCiGPtsCDHYK4",  // the "anon public" key (safe to put in a web page)

  // The address in the QR code. Blank = the folder this page is served from.
  voteUrl: "https://tfsurveys.com",

  title: "Transfinder Live Poll",

  // Your questions, in slide order. Up to 12 choices each.
  // After you change the questions, clear the old results in admin.html.
  questions: [
    {
      text: "How do you plan routes today?",
      choices: ["Routing software", "Spreadsheets", "Paper maps", "A mix"]
    },
    {
      text: "What is your biggest transportation challenge?",
      choices: ["Driver shortage", "Rising costs", "Parent communication", "Late buses"]
    },
    {
      text: "How do parents learn a bus is running late?",
      choices: ["Parent app", "Phone calls", "Social media", "They don't"]
    }
  ]
};
