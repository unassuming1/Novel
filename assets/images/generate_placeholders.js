// Create simple SVG icons for resources
const icons = {
  silver: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#C0C0C0" stroke="#808080" stroke-width="2"/>
    <text x="32" y="38" font-family="Arial" font-size="24" text-anchor="middle" fill="#404040">Ag</text>
  </svg>`,
  
  food: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="20" width="40" height="30" rx="4" fill="#8B4513" stroke="#5D2906" stroke-width="2"/>
    <rect x="18" y="14" width="28" height="10" rx="2" fill="#A0522D" stroke="#5D2906" stroke-width="2"/>
  </svg>`,
  
  water: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 8 L48 32 A16 16 0 1 1 16 32 Z" fill="#4682B4" stroke="#2E5984" stroke-width="2"/>
  </svg>`,
  
  tools: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 48 L16 24 L24 16 L40 16 L48 24 L48 48 Z" fill="#8B4513" stroke="#5D2906" stroke-width="2"/>
    <rect x="28" y="16" width="8" height="32" fill="#5D2906"/>
  </svg>`,
  
  knowledge: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="12" width="36" height="44" rx="2" fill="#F5DEB3" stroke="#8B4513" stroke-width="2"/>
    <line x1="20" y1="22" x2="44" y2="22" stroke="#8B4513" stroke-width="2"/>
    <line x1="20" y1="32" x2="44" y2="32" stroke="#8B4513" stroke-width="2"/>
    <line x1="20" y1="42" x2="44" y2="42" stroke="#8B4513" stroke-width="2"/>
  </svg>`,
  
  favor: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="24" fill="#FFD700" stroke="#B8860B" stroke-width="2"/>
    <path d="M32 16 L36 28 L48 28 L38 36 L42 48 L32 40 L22 48 L26 36 L16 28 L28 28 Z" fill="#B8860B"/>
  </svg>`,
  
  health: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="24" fill="#FF6347" stroke="#8B0000" stroke-width="2"/>
    <rect x="24" y="20" width="16" height="24" fill="#FFFFFF"/>
    <rect x="20" y="24" width="24" height="16" fill="#FFFFFF"/>
  </svg>`
};

// Create character placeholder SVGs
const characters = {
  overseer: `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <circle cx="64" cy="40" r="24" fill="#D2B48C" stroke="#8B4513" stroke-width="2"/>
    <rect x="40" y="64" width="48" height="48" fill="#8B0000" stroke="#5D0000" stroke-width="2"/>
    <rect x="40" y="112" width="20" height="16" fill="#8B4513" stroke="#5D2906" stroke-width="2"/>
    <rect x="68" y="112" width="20" height="16" fill="#8B4513" stroke="#5D2906" stroke-width="2"/>
    <circle cx="56" cy="36" r="4" fill="#000000"/>
    <circle cx="72" cy="36" r="4" fill="#000000"/>
    <path d="M56 50 Q64 56 72 50" fill="none" stroke="#000000" stroke-width="2"/>
    <path d="M40 30 L36 24 L44 26 Z" fill="#8B4513" stroke="#5D2906" stroke-width="1"/>
    <path d="M88 30 L92 24 L84 26 Z" fill="#8B4513" stroke="#5D2906" stroke-width="1"/>
  </svg>`,
  
  messenger: `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <circle cx="64" cy="40" r="24" fill="#D2B48C" stroke="#8B4513" stroke-width="2"/>
    <rect x="40" y="64" width="48" height="48" fill="#4682B4" stroke="#2E5984" stroke-width="2"/>
    <rect x="40" y="112" width="20" height="16" fill="#8B4513" stroke="#5D2906" stroke-width="2"/>
    <rect x="68" y="112" width="20" height="16" fill="#8B4513" stroke="#5D2906" stroke-width="2"/>
    <circle cx="56" cy="36" r="4" fill="#000000"/>
    <circle cx="72" cy="36" r="4" fill="#000000"/>
    <path d="M56 50 Q64 56 72 50" fill="none" stroke="#000000" stroke-width="2"/>
    <rect x="52" y="16" width="24" height="8" fill="#8B4513" stroke="#5D2906" stroke-width="1"/>
  </svg>`,
  
  veteran_slave: `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <circle cx="64" cy="40" r="24" fill="#D2B48C" stroke="#8B4513" stroke-width="2"/>
    <rect x="40" y="64" width="48" height="48" fill="#696969" stroke="#404040" stroke-width="2"/>
    <rect x="40" y="112" width="20" height="16" fill="#8B4513" stroke="#5D2906" stroke-width="2"/>
    <rect x="68" y="112" width="20" height="16" fill="#8B4513" stroke="#5D2906" stroke-width="2"/>
    <circle cx="56" cy="36" r="4" fill="#000000"/>
    <circle cx="72" cy="36" r="4" fill="#000000"/>
    <path d="M56 50 Q64 46 72 50" fill="none" stroke="#000000" stroke-width="2"/>
    <line x1="48" y1="28" x2="80" y2="28" stroke="#8B4513" stroke-width="1"/>
  </svg>`,
  
  medicus: `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <circle cx="64" cy="40" r="24" fill="#D2B48C" stroke="#8B4513" stroke-width="2"/>
    <rect x="40" y="64" width="48" height="48" fill="#FFFFFF" stroke="#C0C0C0" stroke-width="2"/>
    <rect x="40" y="112" width="20" height="16" fill="#8B4513" stroke="#5D2906" stroke-width="2"/>
    <rect x="68" y="112" width="20" height="16" fill="#8B4513" stroke="#5D2906" stroke-width="2"/>
    <circle cx="56" cy="36" r="4" fill="#000000"/>
    <circle cx="72" cy="36" r="4" fill="#000000"/>
    <path d="M56 50 Q64 56 72 50" fill="none" stroke="#000000" stroke-width="2"/>
    <rect x="56" y="76" width="16" height="24" fill="#FF0000"/>
    <rect x="52" y="80" width="24" height="16" fill="#FF0000"/>
  </svg>`
};

// Create mine background SVGs
const backgrounds = {
  mine_entrance: `<svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="400" fill="#87CEEB"/>
    <rect y="250" width="800" height="150" fill="#8B4513"/>
    <rect x="300" y="150" width="200" height="150" fill="#000000"/>
    <path d="M300 150 L250 250 L350 250 Z" fill="#696969"/>
    <path d="M500 150 L450 250 L550 250 Z" fill="#696969"/>
    <rect x="250" y="250" width="300" height="20" fill="#8B4513"/>
  </svg>`,
  
  mine_tunnel: `<svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="400" fill="#696969"/>
    <ellipse cx="400" cy="200" rx="200" ry="150" fill="#000000"/>
    <rect x="350" y="200" width="100" height="200" fill="#000000"/>
    <ellipse cx="300" cy="150" rx="20" ry="15" fill="#C0C0C0"/>
    <ellipse cx="500" cy="180" rx="15" ry="10" fill="#C0C0C0"/>
    <ellipse cx="400" cy="120" rx="25" ry="20" fill="#C0C0C0"/>
  </svg>`,
  
  mine_work_area: `<svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="400" fill="#696969"/>
    <rect x="100" y="100" width="600" height="200" fill="#4D4D4D"/>
    <ellipse cx="200" cy="150" rx="30" ry="20" fill="#C0C0C0"/>
    <ellipse cx="400" cy="130" rx="40" ry="25" fill="#C0C0C0"/>
    <ellipse cx="600" cy="160" rx="35" ry="22" fill="#C0C0C0"/>
    <rect x="300" y="200" width="200" height="100" fill="#8B4513"/>
    <rect x="350" y="250" width="100" height="50" fill="#A0522D"/>
  </svg>`
};

// Function to save SVGs as files
function saveSVGs() {
  // Save resource icons
  for (const [name, svg] of Object.entries(icons)) {
    const filePath = `/home/ubuntu/Novel/assets/images/icons/${name}.svg`;
    fs.writeFileSync(filePath, svg);
  }
  
  // Save character portraits
  for (const [name, svg] of Object.entries(characters)) {
    const filePath = `/home/ubuntu/Novel/assets/images/characters/${name}.svg`;
    fs.writeFileSync(filePath, svg);
  }
  
  // Save backgrounds
  for (const [name, svg] of Object.entries(backgrounds)) {
    const filePath = `/home/ubuntu/Novel/assets/images/backgrounds/${name}.svg`;
    fs.writeFileSync(filePath, svg);
  }
}

// Export the SVGs
module.exports = {
  icons,
  characters,
  backgrounds,
  saveSVGs
};
