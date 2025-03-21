// Create SVG images for the game
const fs = require('fs');
const path = require('path');

// Ensure directories exist
const directories = [
  'icons',
  'mine',
  'characters',
  'backgrounds'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Create SVG images
const images = [
  // Mine images
  {
    name: 'mine/mine_entrance.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#5d4037"/>
      <path d="M50,100 L150,100 L130,180 L70,180 Z" fill="#3e2723"/>
      <ellipse cx="100" cy="100" rx="30" ry="40" fill="#1a1a1a"/>
      <rect x="85" y="100" width="30" height="80" fill="#1a1a1a"/>
    </svg>`
  },
  {
    name: 'mine/deep_mine.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#3e2723"/>
      <path d="M30,30 L170,30 L150,170 L50,170 Z" fill="#1a1a1a"/>
      <path d="M60,50 L140,50 L130,150 L70,150 Z" fill="#0d0d0d"/>
      <circle cx="120" cy="70" r="5" fill="#f57f17" opacity="0.7"/>
      <circle cx="120" cy="70" r="10" fill="#f57f17" opacity="0.3"/>
    </svg>`
  },
  {
    name: 'mine/silver_ore.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#424242"/>
      <ellipse cx="100" cy="100" rx="70" ry="60" fill="#616161"/>
      <path d="M70,80 L90,70 L110,90 L130,70 L120,100 L140,110 L120,120 L130,140 L100,130 L80,150 L70,120 L50,110 Z" fill="#bdbdbd"/>
      <path d="M80,90 L100,80 L110,100 L120,90 L110,110 L120,120 L100,125 L90,140 L80,120 L70,115 Z" fill="#e0e0e0"/>
    </svg>`
  },
  
  // Character images
  {
    name: 'characters/slave.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="transparent"/>
      <circle cx="100" cy="70" r="30" fill="#8d6e63"/>
      <rect x="70" y="100" width="60" height="80" fill="#5d4037"/>
      <rect x="60" y="100" width="80" height="30" fill="#8d6e63"/>
      <rect x="70" y="130" width="20" height="50" fill="#8d6e63"/>
      <rect x="110" y="130" width="20" height="50" fill="#8d6e63"/>
      <circle cx="85" cy="65" r="5" fill="white"/>
      <circle cx="115" cy="65" r="5" fill="white"/>
      <circle cx="85" cy="65" r="2" fill="black"/>
      <circle cx="115" cy="65" r="2" fill="black"/>
      <path d="M90,80 Q100,90 110,80" fill="transparent" stroke="#6d4c41" stroke-width="2"/>
    </svg>`
  },
  {
    name: 'characters/overseer.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="transparent"/>
      <circle cx="100" cy="70" r="30" fill="#a1887f"/>
      <rect x="70" y="100" width="60" height="80" fill="#795548"/>
      <rect x="60" y="100" width="80" height="30" fill="#a1887f"/>
      <rect x="70" y="130" width="20" height="50" fill="#a1887f"/>
      <rect x="110" y="130" width="20" height="50" fill="#a1887f"/>
      <circle cx="85" cy="65" r="5" fill="white"/>
      <circle cx="115" cy="65" r="5" fill="white"/>
      <circle cx="85" cy="65" r="2" fill="black"/>
      <circle cx="115" cy="65" r="2" fill="black"/>
      <path d="M90,85 Q100,75 110,85" fill="transparent" stroke="#6d4c41" stroke-width="2"/>
      <rect x="70" y="50" width="60" height="10" fill="#4e342e"/>
      <rect x="85" y="40" width="30" height="10" fill="#4e342e"/>
    </svg>`
  },
  {
    name: 'characters/sulla_portrait.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#d7ccc8"/>
      <circle cx="100" cy="80" r="50" fill="#bcaaa4"/>
      <ellipse cx="100" cy="75" rx="40" ry="45" fill="#a1887f"/>
      <path d="M70,60 Q100,40 130,60" fill="transparent" stroke="#8d6e63" stroke-width="5"/>
      <circle cx="85" cy="70" r="5" fill="white"/>
      <circle cx="115" cy="70" r="5" fill="white"/>
      <circle cx="85" cy="70" r="2" fill="black"/>
      <circle cx="115" cy="70" r="2" fill="black"/>
      <path d="M90,90 Q100,95 110,90" fill="transparent" stroke="#6d4c41" stroke-width="2"/>
      <path d="M60,80 Q70,120 100,130 Q130,120 140,80" fill="transparent" stroke="#8d6e63" stroke-width="5"/>
      <path d="M70,40 Q100,30 130,40" fill="#8d6e63"/>
      <path d="M80,130 Q100,140 120,130" fill="#8d6e63"/>
      <circle cx="75" cy="65" r="3" fill="#d50000"/>
      <circle cx="85" cy="85" r="2" fill="#d50000"/>
      <circle cx="110" cy="75" r="4" fill="#d50000"/>
    </svg>`
  },
  {
    name: 'characters/veteran.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="transparent"/>
      <circle cx="100" cy="70" r="30" fill="#a1887f"/>
      <rect x="70" y="100" width="60" height="80" fill="#795548"/>
      <rect x="60" y="100" width="80" height="30" fill="#a1887f"/>
      <rect x="70" y="130" width="20" height="50" fill="#a1887f"/>
      <rect x="110" y="130" width="20" height="50" fill="#a1887f"/>
      <circle cx="85" cy="65" r="5" fill="white"/>
      <circle cx="115" cy="65" r="5" fill="white"/>
      <circle cx="85" cy="65" r="2" fill="black"/>
      <circle cx="115" cy="65" r="2" fill="black"/>
      <path d="M90,85 Q100,75 110,85" fill="transparent" stroke="#6d4c41" stroke-width="2"/>
      <path d="M70,70 L130,70" fill="transparent" stroke="#6d4c41" stroke-width="2"/>
      <rect x="90" y="100" width="20" height="60" fill="#bf360c"/>
      <rect x="85" y="100" width="30" height="10" fill="#bf360c"/>
    </svg>`
  },
  
  // Icons
  {
    name: 'icons/silver.svg',
    content: `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#bdbdbd"/>
      <circle cx="50" cy="50" r="35" fill="#e0e0e0"/>
      <text x="50" y="65" font-family="Arial" font-size="40" text-anchor="middle" fill="#757575">S</text>
    </svg>`
  },
  {
    name: 'icons/food.svg',
    content: `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#8bc34a"/>
      <circle cx="50" cy="50" r="35" fill="#aed581"/>
      <text x="50" y="65" font-family="Arial" font-size="40" text-anchor="middle" fill="#33691e">F</text>
    </svg>`
  },
  {
    name: 'icons/water.svg',
    content: `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#2196f3"/>
      <circle cx="50" cy="50" r="35" fill="#64b5f6"/>
      <text x="50" y="65" font-family="Arial" font-size="40" text-anchor="middle" fill="#0d47a1">W</text>
    </svg>`
  },
  {
    name: 'icons/tools.svg',
    content: `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#795548"/>
      <circle cx="50" cy="50" r="35" fill="#a1887f"/>
      <text x="50" y="65" font-family="Arial" font-size="40" text-anchor="middle" fill="#3e2723">T</text>
    </svg>`
  },
  {
    name: 'icons/knowledge.svg',
    content: `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#ff9800"/>
      <circle cx="50" cy="50" r="35" fill="#ffb74d"/>
      <text x="50" y="65" font-family="Arial" font-size="40" text-anchor="middle" fill="#e65100">K</text>
    </svg>`
  },
  {
    name: 'icons/favor.svg',
    content: `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#9c27b0"/>
      <circle cx="50" cy="50" r="35" fill="#ba68c8"/>
      <text x="50" y="65" font-family="Arial" font-size="40" text-anchor="middle" fill="#4a148c">F</text>
    </svg>`
  },
  {
    name: 'icons/health.svg',
    content: `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#f44336"/>
      <circle cx="50" cy="50" r="35" fill="#e57373"/>
      <text x="50" y="65" font-family="Arial" font-size="40" text-anchor="middle" fill="#b71c1c">H</text>
    </svg>`
  },
  
  // Story-related images
  {
    name: 'backgrounds/grass_crown.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="transparent" stroke="#8bc34a" stroke-width="5"/>
      <path d="M40,100 Q60,70 80,90 Q100,60 120,90 Q140,70 160,100" fill="transparent" stroke="#7cb342" stroke-width="3"/>
      <path d="M40,110 Q70,90 100,110 Q130,90 160,110" fill="transparent" stroke="#7cb342" stroke-width="3"/>
      <path d="M50,80 L55,70 L60,80 M70,70 L75,60 L80,70 M90,65 L95,55 L100,65 M110,65 L115,55 L120,65 M130,70 L135,60 L140,70 M150,80 L155,70 L160,80" fill="transparent" stroke="#8bc34a" stroke-width="2"/>
      <circle cx="55" cy="65" r="3" fill="#ffeb3b"/>
      <circle cx="95" cy="50" r="3" fill="#ffeb3b"/>
      <circle cx="135" cy="65" r="3" fill="#ffeb3b"/>
      <circle cx="75" cy="85" r="3" fill="#f44336"/>
      <circle cx="115" cy="85" r="3" fill="#f44336"/>
    </svg>`
  },
  {
    name: 'backgrounds/grass_crown_detail.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#f1f8e9"/>
      <circle cx="100" cy="100" r="80" fill="transparent" stroke="#8bc34a" stroke-width="5"/>
      <path d="M40,100 Q60,70 80,90 Q100,60 120,90 Q140,70 160,100" fill="transparent" stroke="#7cb342" stroke-width="3"/>
      <path d="M40,110 Q70,90 100,110 Q130,90 160,110" fill="transparent" stroke="#7cb342" stroke-width="3"/>
      <path d="M50,80 L55,70 L60,80 M70,70 L75,60 L80,70 M90,65 L95,55 L100,65 M110,65 L115,55 L120,65 M130,70 L135,60 L140,70 M150,80 L155,70 L160,80" fill="transparent" stroke="#8bc34a" stroke-width="2"/>
      <circle cx="55" cy="65" r="5" fill="#ffeb3b"/>
      <circle cx="95" cy="50" r="5" fill="#ffeb3b"/>
      <circle cx="135" cy="65" r="5" fill="#ffeb3b"/>
      <circle cx="75" cy="85" r="5" fill="#f44336"/>
      <circle cx="115" cy="85" r="5" fill="#f44336"/>
      <circle cx="155" cy="95" r="5" fill="#ba68c8"/>
      <circle cx="45" cy="95" r="5" fill="#ba68c8"/>
      <text x="100" y="150" font-family="Arial" font-size="12" text-anchor="middle" fill="#33691e">CORONA GRAMINEA</text>
    </svg>`
  },
  {
    name: 'backgrounds/roman_legion.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#f5f5f5"/>
      <rect x="20" y="120" width="160" height="60" fill="#795548"/>
      <rect x="40" y="20" width="120" height="100" fill="#b71c1c"/>
      <text x="100" y="80" font-family="Arial" font-size="40" text-anchor="middle" fill="#f5f5f5">SPQR</text>
      <path d="M40,20 L100,5 L160,20" fill="transparent" stroke="#ffd600" stroke-width="3"/>
      <path d="M30,140 L50,140 M60,140 L80,140 M90,140 L110,140 M120,140 L140,140 M150,140 L170,140" fill="transparent" stroke="#ffd600" stroke-width="5"/>
      <path d="M30,160 L50,160 M60,160 L80,160 M90,160 L110,160 M120,160 L140,160 M150,160 L170,160" fill="transparent" stroke="#ffd600" stroke-width="5"/>
    </svg>`
  },
  {
    name: 'backgrounds/roman_politics.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#e0e0e0"/>
      <path d="M20,180 L20,80 L60,40 L140,40 L180,80 L180,180 Z" fill="#f5f5f5"/>
      <rect x="40" y="180" width="20" height="-80" fill="#bdbdbd"/>
      <rect x="70" y="180" width="20" height="-100" fill="#bdbdbd"/>
      <rect x="100" y="180" width="20" height="-90" fill="#bdbdbd"/>
      <rect x="130" y="180" width="20" height="-100" fill="#bdbdbd"/>
      <rect x="160" y="180" width="20" height="-80" fill="#bdbdbd"/>
      <path d="M20,80 L60,40 L140,40 L180,80" fill="transparent" stroke="#9e9e9e" stroke-width="3"/>
      <circle cx="100" cy="20" r="10" fill="#ffd600"/>
    </svg>`
  },
  {
    name: 'backgrounds/roman_senate.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#e0e0e0"/>
      <path d="M20,180 L20,80 L60,40 L140,40 L180,80 L180,180 Z" fill="#f5f5f5"/>
      <rect x="40" y="180" width="20" height="-80" fill="#bdbdbd"/>
      <rect x="70" y="180" width="20" height="-100" fill="#bdbdbd"/>
      <rect x="100" y="180" width="20" height="-90" fill="#bdbdbd"/>
      <rect x="130" y="180" width="20" height="-100" fill="#bdbdbd"/>
      <rect x="160" y="180" width="20" height="-80" fill="#bdbdbd"/>
      <path d="M20,80 L60,40 L140,40 L180,80" fill="transparent" stroke="#9e9e9e" stroke-width="3"/>
      <circle cx="50" cy="120" r="5" fill="#795548"/>
      <circle cx="70" cy="120" r="5" fill="#795548"/>
      <circle cx="90" cy="120" r="5" fill="#795548"/>
      <circle cx="110" cy="120" r="5" fill="#795548"/>
      <circle cx="130" cy="120" r="5" fill="#795548"/>
      <circle cx="150" cy="120" r="5" fill="#795548"/>
      <circle cx="60" cy="140" r="5" fill="#795548"/>
      <circle cx="80" cy="140" r="5" fill="#795548"/>
      <circle cx="100" cy="140" r="5" fill="#795548"/>
      <circle cx="120" cy="140" r="5" fill="#795548"/>
      <circle cx="140" cy="140" r="5" fill="#795548"/>
    </svg>`
  },
  {
    name: 'backgrounds/betrayal.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#e0e0e0"/>
      <circle cx="70" cy="100" r="40" fill="#795548"/>
      <circle cx="130" cy="100" r="40" fill="#795548"/>
      <circle cx="70" cy="90" r="10" fill="white"/>
      <circle cx="130" cy="90" r="10" fill="white"/>
      <circle cx="70" cy="90" r="5" fill="black"/>
      <circle cx="130" cy="90" r="5" fill="black"/>
      <path d="M50,110 Q70,120 90,110" fill="transparent" stroke="#5d4037" stroke-width="2"/>
      <path d="M110,110 Q130,100 150,110" fill="transparent" stroke="#5d4037" stroke-width="2"/>
      <path d="M100,130 L120,70" fill="transparent" stroke="#b71c1c" stroke-width="5"/>
      <path d="M80,70 L140,130" fill="transparent" stroke="#b71c1c" stroke-width="5"/>
    </svg>`
  },
  {
    name: 'backgrounds/rome_march.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#e0e0e0"/>
      <path d="M20,180 L20,80 L60,40 L140,40 L180,80 L180,180 Z" fill="#f5f5f5"/>
      <rect x="40" y="180" width="20" height="-80" fill="#bdbdbd"/>
      <rect x="70" y="180" width="20" height="-100" fill="#bdbdbd"/>
      <rect x="100" y="180" width="20" height="-90" fill="#bdbdbd"/>
      <rect x="130" y="180" width="20" height="-100" fill="#bdbdbd"/>
      <rect x="160" y="180" width="20" height="-80" fill="#bdbdbd"/>
      <path d="M20,80 L60,40 L140,40 L180,80" fill="transparent" stroke="#9e9e9e" stroke-width="3"/>
      <path d="M10,150 L190,150" fill="transparent" stroke="#795548" stroke-width="2"/>
      <rect x="30" y="150" width="10" height="-20" fill="#795548"/>
      <rect x="50" y="150" width="10" height="-20" fill="#795548"/>
      <rect x="70" y="150" width="10" height="-20" fill="#795548"/>
      <rect x="90" y="150" width="10" height="-20" fill="#795548"/>
      <rect x="110" y="150" width="10" height="-20" fill="#795548"/>
      <rect x="130" y="150" width="10" height="-20" fill="#795548"/>
      <rect x="150" y="150" width="10" height="-20" fill="#795548"/>
      <rect x="170" y="150" width="10" height="-20" fill="#795548"/>
      <circle cx="100" cy="110" r="15" fill="#b71c1c"/>
      <text x="100" y="115" font-family="Arial" font-size="10" text-anchor="middle" fill="#f5f5f5">SPQR</text>
    </svg>`
  },
  {
    name: 'backgrounds/dictator.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#e0e0e0"/>
      <circle cx="100" cy="80" r="40" fill="#795548"/>
      <circle cx="100" cy="75" r="30" fill="#8d6e63"/>
      <circle cx="85" cy="70" r="5" fill="white"/>
      <circle cx="115" cy="70" r="5" fill="white"/>
      <circle cx="85" cy="70" r="2" fill="black"/>
      <circle cx="115" cy="70" r="2" fill="black"/>
      <path d="M90,90 Q100,95 110,90" fill="transparent" stroke="#5d4037" stroke-width="2"/>
      <path d="M60,40 Q100,20 140,40" fill="#b71c1c"/>
      <path d="M60,40 Q100,60 140,40" fill="#b71c1c"/>
      <circle cx="100" cy="40" r="10" fill="#ffd600"/>
      <path d="M70,120 L130,120 L120,180 L80,180 Z" fill="#b71c1c"/>
      <path d="M80,120 L120,120 L110,150 L90,150 Z" fill="#ffd600"/>
    </svg>`
  },
  {
    name: 'backgrounds/proscriptions.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#f5f5f5"/>
      <rect x="40" y="40" width="120" height="160" fill="#e0e0e0"/>
      <path d="M50,60 L150,60" fill="transparent" stroke="#b71c1c" stroke-width="2"/>
      <path d="M50,80 L150,80" fill="transparent" stroke="#b71c1c" stroke-width="2"/>
      <path d="M50,100 L150,100" fill="transparent" stroke="#b71c1c" stroke-width="2"/>
      <path d="M50,120 L150,120" fill="transparent" stroke="#b71c1c" stroke-width="2"/>
      <path d="M50,140 L150,140" fill="transparent" stroke="#b71c1c" stroke-width="2"/>
      <path d="M50,160 L150,160" fill="transparent" stroke="#b71c1c" stroke-width="2"/>
      <path d="M50,180 L150,180" fill="transparent" stroke="#b71c1c" stroke-width="2"/>
      <path d="M40,40 L160,40 L160,200 L40,200 Z" fill="transparent" stroke="#b71c1c" stroke-width="4"/>
      <text x="100" y="30" font-family="Arial" font-size="16" text-anchor="middle" fill="#b71c1c">PROSCRIPTIO</text>
    </svg>`
  },
  {
    name: 'backgrounds/reforms.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#f5f5f5"/>
      <rect x="40" y="40" width="120" height="160" fill="#e0e0e0"/>
      <path d="M50,60 L150,60" fill="transparent" stroke="#000000" stroke-width="2"/>
      <path d="M50,80 L150,80" fill="transparent" stroke="#000000" stroke-width="2"/>
      <path d="M50,100 L150,100" fill="transparent" stroke="#000000" stroke-width="2"/>
      <path d="M50,120 L150,120" fill="transparent" stroke="#000000" stroke-width="2"/>
      <path d="M50,140 L150,140" fill="transparent" stroke="#000000" stroke-width="2"/>
      <path d="M50,160 L150,160" fill="transparent" stroke="#000000" stroke-width="2"/>
      <path d="M50,180 L150,180" fill="transparent" stroke="#000000" stroke-width="2"/>
      <path d="M40,40 L160,40 L160,200 L40,200 Z" fill="transparent" stroke="#000000" stroke-width="4"/>
      <text x="100" y="30" font-family="Arial" font-size="16" text-anchor="middle" fill="#000000">LEX CORNELIA</text>
    </svg>`
  },
  {
    name: 'backgrounds/retirement.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#81c784"/>
      <path d="M0,150 L200,150" fill="transparent" stroke="#33691e" stroke-width="2"/>
      <path d="M50,150 L100,80 L150,150" fill="#795548"/>
      <rect x="80" y="150" width="40" height="-30" fill="#5d4037"/>
      <rect x="95" y="120" width="10" height="20" fill="#3e2723"/>
      <circle cx="40" cy="130" r="10" fill="#33691e"/>
      <circle cx="60" cy="120" r="15" fill="#33691e"/>
      <circle cx="160" cy="130" r="10" fill="#33691e"/>
      <circle cx="140" cy="120" r="15" fill="#33691e"/>
      <circle cx="100" cy="50" r="20" fill="#ffd600" opacity="0.8"/>
      <circle cx="100" cy="50" r="30" fill="#ffd600" opacity="0.3"/>
    </svg>`
  },
  {
    name: 'backgrounds/funeral.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#424242"/>
      <rect x="60" y="80" width="80" height="40" fill="#5d4037"/>
      <rect x="70" y="70" width="60" height="10" fill="#3e2723"/>
      <path d="M50,120 L150,120" fill="transparent" stroke="#3e2723" stroke-width="2"/>
      <circle cx="60" cy="140" r="5" fill="#ff8a65"/>
      <circle cx="60" cy="140" r="10" fill="#ff8a65" opacity="0.5"/>
      <circle cx="100" cy="140" r="5" fill="#ff8a65"/>
      <circle cx="100" cy="140" r="10" fill="#ff8a65" opacity="0.5"/>
      <circle cx="140" cy="140" r="5" fill="#ff8a65"/>
      <circle cx="140" cy="140" r="10" fill="#ff8a65" opacity="0.5"/>
      <path d="M30,80 Q100,40 170,80" fill="transparent" stroke="#8bc34a" stroke-width="3"/>
      <path d="M40,70 L45,60 L50,70 M60,60 L65,50 L70,60 M80,55 L85,45 L90,55 M100,50 L105,40 L110,50 M120,55 L125,45 L130,55 M140,60 L145,50 L150,60 M160,70 L165,60 L170,70" fill="transparent" stroke="#7cb342" stroke-width="2"/>
    </svg>`
  },
  {
    name: 'backgrounds/legacy.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#e0e0e0"/>
      <circle cx="100" cy="100" r="60" fill="#f5f5f5"/>
      <path d="M60,100 Q80,70 100,90 Q120,70 140,100" fill="transparent" stroke="#7cb342" stroke-width="3"/>
      <path d="M60,110 Q90,90 120,110" fill="transparent" stroke="#7cb342" stroke-width="3"/>
      <path d="M70,80 L75,70 L80,80 M90,70 L95,60 L100,70 M110,70 L115,60 L120,70 M130,80 L135,70 L140,80" fill="transparent" stroke="#8bc34a" stroke-width="2"/>
      <circle cx="75" cy="65" r="3" fill="#ffeb3b"/>
      <circle cx="115" cy="65" r="3" fill="#ffeb3b"/>
      <circle cx="95" cy="85" r="3" fill="#f44336"/>
      <rect x="70" y="120" width="60" height="40" fill="#9e9e9e"/>
      <rect x="80" y="120" width="40" height="20" fill="#bdbdbd"/>
      <path d="M70,160 L130,160" fill="transparent" stroke="#757575" stroke-width="2"/>
    </svg>`
  },
  {
    name: 'backgrounds/message.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#f5f5f5"/>
      <rect x="40" y="60" width="120" height="80" fill="#e0e0e0"/>
      <path d="M40,60 L100,100 L160,60" fill="transparent" stroke="#9e9e9e" stroke-width="2"/>
      <path d="M40,140 L80,110" fill="transparent" stroke="#9e9e9e" stroke-width="2"/>
      <path d="M160,140 L120,110" fill="transparent" stroke="#9e9e9e" stroke-width="2"/>
      <path d="M60,90 L140,90" fill="transparent" stroke="#b71c1c" stroke-width="1" stroke-dasharray="2,2"/>
      <path d="M60,100 L140,100" fill="transparent" stroke="#b71c1c" stroke-width="1" stroke-dasharray="2,2"/>
      <path d="M60,110 L140,110" fill="transparent" stroke="#b71c1c" stroke-width="1" stroke-dasharray="2,2"/>
    </svg>`
  },
  {
    name: 'backgrounds/denarius.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="#e0e0e0"/>
      <circle cx="100" cy="100" r="75" fill="#f5f5f5"/>
      <circle cx="100" cy="100" r="70" fill="#bdbdbd"/>
      <circle cx="100" cy="100" r="60" fill="#e0e0e0"/>
      <path d="M70,80 Q100,60 130,80 Q140,100 130,120 Q100,140 70,120 Q60,100 70,80" fill="transparent" stroke="#9e9e9e" stroke-width="3"/>
      <text x="100" y="110" font-family="Arial" font-size="30" text-anchor="middle" fill="#757575">SPQR</text>
    </svg>`
  },
  {
    name: 'backgrounds/slaves.svg',
    content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#424242"/>
      <circle cx="70" cy="70" r="20" fill="#8d6e63"/>
      <rect x="50" y="90" width="40" height="60" fill="#5d4037"/>
      <rect x="45" y="90" width="50" height="20" fill="#8d6e63"/>
      <rect x="50" y="110" width="15" height="40" fill="#8d6e63"/>
      <rect x="75" y="110" width="15" height="40" fill="#8d6e63"/>
      <circle cx="60" cy="65" r="4" fill="white"/>
      <circle cx="80" cy="65" r="4" fill="white"/>
      <circle cx="60" cy="65" r="2" fill="black"/>
      <circle cx="80" cy="65" r="2" fill="black"/>
      <path d="M65,75 Q70,80 75,75" fill="transparent" stroke="#5d4037" stroke-width="2"/>
      
      <circle cx="130" cy="70" r="20" fill="#8d6e63"/>
      <rect x="110" y="90" width="40" height="60" fill="#5d4037"/>
      <rect x="105" y="90" width="50" height="20" fill="#8d6e63"/>
      <rect x="110" y="110" width="15" height="40" fill="#8d6e63"/>
      <rect x="135" y="110" width="15" height="40" fill="#8d6e63"/>
      <circle cx="120" cy="65" r="4" fill="white"/>
      <circle cx="140" cy="65" r="4" fill="white"/>
      <circle cx="120" cy="65" r="2" fill="black"/>
      <circle cx="140" cy="65" r="2" fill="black"/>
      <path d="M125,75 Q130,80 135,75" fill="transparent" stroke="#5d4037" stroke-width="2"/>
      
      <path d="M90,130 L110,130" fill="transparent" stroke="#8d6e63" stroke-width="5"/>
      <circle cx="90" cy="130" r="5" fill="#5d4037"/>
      <circle cx="110" cy="130" r="5" fill="#5d4037"/>
    </svg>`
  }
];

// Write SVG files
images.forEach(image => {
  const filePath = path.join(__dirname, image.name);
  fs.writeFileSync(filePath, image.content);
  console.log(`Created ${image.name}`);
});

console.log('All SVG images created successfully!');
