# Space Invaders

A classic Space Invaders game built with HTML5 Canvas and vanilla JavaScript. This project demonstrates various programming paradigms and patterns while providing an engaging gaming experience.

## Game Features

### Core Mechanics

- **Player Controls**: Move left/right and shoot with the spacebar
- **Enemy Formation**: 5 rows of 11 enemies each with different characteristics
- **Shield System**: Three protective shields that can be destroyed
- **Scoring System**: Different point values based on enemy type
- **Lives System**: Three lives with invulnerability period after being hit

### Enemy Types

1. **Top Row (Dark Red)**: 40 points
2. **Second Row (Red)**: 30 points
3. **Third Row (Bright Red)**: 20 points
4. **Fourth Row (Brighter Red)**: 10 points
5. **Bottom Row (Brightest Red)**: 5 points

### Progressive Difficulty

- Enemies move faster as their numbers decrease
- Enemy shot frequency increases as more enemies are destroyed
- Enemy movement speed increases after each row drop
- Minimum shot interval to maintain playability

### Shield Mechanics

- Three shields placed strategically at the bottom
- Each shield has 3 health points
- Health bars display current shield status
- Color-coded health indicators:
  - Green: Full health (3)
  - Yellow: Medium health (2)
  - Red: Low health (1)

## How to Play

### Controls

- **Left Arrow**: Move player left
- **Right Arrow**: Move player right
- **Spacebar**: Shoot
- **Restart Button**: Start a new game after game over

### Game Rules

1. Destroy all enemies to win
2. Avoid enemy bullets and collisions
3. Use shields strategically for protection
4. Game over conditions:
   - Player loses all lives
   - Enemies reach the bottom
   - All enemies are destroyed (win)

### Scoring

- Top row enemies: 40 points
- Second row enemies: 30 points
- Third row enemies: 20 points
- Fourth row enemies: 10 points
- Bottom row enemies: 5 points

## Technical Features

### Programming Paradigms

- Object-Oriented Programming (OOP)
- Functional Programming
- Event-Driven Programming
- Game State Management

### Game Components

- Player ship with movement and shooting
- Enemy grid with different types and behaviors
- Shield system with health management
- Collision detection system
- Score and lives tracking
- Game over and restart functionality

### Performance Optimizations

- Efficient canvas rendering
- Optimized collision detection
- Dynamic difficulty adjustment
- Smooth animation using requestAnimationFrame

## Development

### Technologies Used

- HTML5 Canvas
- Vanilla JavaScript
- CSS3

### No External Dependencies

This game is built using only native web technologies without any external libraries or frameworks.

## Game Balance

### Movement Speeds

- Player Speed: 5
- Player Bullet Speed: 7
- Enemy Bullet Speed: 3
- Enemy Movement Speed: 5
- Enemy Drop Distance: 20 pixels

### Timing Intervals

- Enemy Movement Interval: 400ms
- Base Enemy Shot Interval: 800ms
- Minimum Enemy Shot Interval: 300ms
- Player Invulnerability Duration: 2000ms (2 seconds)

### Player Mechanics

- Lives: 3
- Invulnerability Period: 2 seconds after being hit
- Invulnerability Effect: Player ship blinks during invulnerability

## Getting Started

1. Clone the repository
2. Open `index.html` in a modern web browser
3. Use arrow keys to move and spacebar to shoot
4. Try to achieve the highest score possible!

## Future Improvements

- [ ] 🏆 High score system
- [ ] ⚡ Power-ups and special abilities
- [ ] 👾 Different enemy attack patterns
- [ ] 🔊 Sound effects and background music
- [ ] 📱 Mobile touch controls
