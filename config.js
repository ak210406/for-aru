// Proposal Website Configuration
const CONFIG = {
  // Names
  crushName: "Aru", // Her nickname is Aru
  yourName: "Your Name", // Replace with your name or use the live editor!

  // The Big Question
  questionTitle: "Will you do me the honor...",
  questionText: "...and continue this beautiful journey as my lifelong teammate and love?",
  yesButtonText: "Yes, I will! ❤️",
  noButtonText: "No",

  // Custom Pleading Messages (when she hovers over/taps 'No')
  pleadingMessages: [
    "Are you sure, Aru? 🥺",
    "Think about Varanasi... and us! 🌸",
    "Since Dec 25, 2019... we make the best team! 🥺",
    "Is that your final answer? 💔",
    "Nice try, but try again! 😉",
    "Error: Incorrect option selected!",
    "Yes is much more click-friendly! ❤️",
    "Give it a chance, Aru! 🌟",
    "No way! Click Yes! ❤️",
    "Hold on, let me ask again..."
  ],

  // Story & Quiz Slides
  // We added interactive trivia checks to make it way more engaging!
  slides: [
    {
      title: "From the beautiful lanes of Varanasi...",
      text: "A girl named Arpita (whom I lovingly call Aru) came into my life and turned my whole world into a brighter, happier place.",
      image: "" // Empty uses default romantic vector illustration
    },
    {
      title: "Since December 25th, 2019...",
      text: "It has been an incredible journey of love, support, and laughter. Over 6 years of sharing dreams, facing challenges, and growing together.",
      image: ""
    },
    // Quiz Slide 1
    {
      title: "Trivia Time! 🗓️",
      text: "Let's test your memory: When did our story officially begin?",
      quiz: {
        options: ["Jan 1st, 2020", "Dec 25th, 2019", "Feb 14th, 2019"],
        correctIndex: 1,
        successMessage: "Correct! The best Christmas gift ever. 🎁❤️",
        errorMessage: "Wrong! Think about Christmas... 😉"
      }
    },
    // Quiz Slide 2
    {
      title: "Geography Check! 🗺️",
      text: "Which spiritual city is my favorite person (you!) from?",
      quiz: {
        options: ["Delhi", "Varanasi", "Mumbai"],
        correctIndex: 1,
        successMessage: "Correct! The city of ghats, light, and magic. ✨",
        errorMessage: "Wait, did you forget where you live? 😱"
      }
    },
    // Quiz Slide 3
    {
      title: "The Ultimate Question... ❤️",
      text: "Who loves the other more?",
      quiz: {
        options: ["I do!", "No, I do!", "It's an infinite tie! ❤️"],
        correctIndex: 2,
        successMessage: "YES! It's a never-ending infinite loop of love. ♾️❤️",
        errorMessage: "Hmm, try option 3... it's the absolute truth! 😉"
      }
    }
  ],

  // Yes Celebration Screen
  celebrationTitle: "YES! You've made me the happiest! ❤️",
  celebrationText: "Here's to us, from Dec 25, 2019, to forever. I love you, Aru!",
  celebrationImage: "images/background.png", // Uses the generated romantic starry night background

  // Love Coupon Book - Fun rewards she can redeem on WhatsApp!
  coupons: [
    { title: "Varanasi Street Food Date 🍲", desc: "Redeem for unlimited chaat, lassi, and street treats with me!" },
    { title: "Late Night Long Drive 🚗", desc: "A cozy nighttime drive with your favorite playlist playing." },
    { title: "Unlimited Warm Hugs 🧸", desc: "Valid anytime, anywhere, for as long as you need." },
    { title: "Coffee & Deep Conversations ☕", desc: "A quiet, romantic evening chatting about everything and nothing." }
  ],

  // Actions on Yes (Hardcoded phone number as requested!)
  whatsappNumber: "918809957878", 
  whatsappMessage: "I said YES! ❤️ Happy anniversary since Dec 25, 2019!",

  // Ambient Synthesizer Music (Web Audio API)
  enableSynthMusic: true
};
