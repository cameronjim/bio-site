// Project data shared by the home page cards and the /projects/:slug pages.
// Adding a project = adding an entry here. `art` picks the hand-drawn doodle
// (see components/ProjectArt). Demo videos go in S3 behind CloudFront; set
// `video` (and optionally `poster`) to their URLs once uploaded.

export type ProjectArt =
  | 'car'
  | 'eye'
  | 'gameboy'
  | 'basketball'
  | 'chip'
  | 'terminal'
  | 'cube'
  | 'browser'

export interface Screenshot {
  src: string
  caption: string
}

export interface Project {
  slug: string
  title: string
  // Handwritten margin note shown above the title.
  note: string
  // One or two sentences for the home page card.
  summary: string
  // Paragraphs for the project page.
  writeup: string[]
  tags: string[]
  stack: string[]
  art: ProjectArt
  repo?: string
  live?: string
  liveLabel?: string
  video?: string
  poster?: string
  screenshots?: Screenshot[]
  // Shown wide at the top of the projects grid.
  featured?: boolean
  // Write-up and demo still to come.
  draft?: boolean
}

// The emulator lives at /play (the build is in public/play/, see scripts/update-emulator.sh).
export const PLAY_URL = '/play'

export interface PlayGame {
  rom: string
  title: string
}

export const PLAY_GAMES: PlayGame[] = [
  { rom: 'mario.gbc', title: 'Super Mario Bros' },
  { rom: 'tetris.gb', title: 'Tetris' },
  { rom: 'flappy.gb', title: 'Flappy Bird' },
  { rom: 'crossy.gb', title: 'Crossy Road' },
]

export const PROJECTS: Project[] = [
  {
    slug: 'race-car',
    title: 'Autonomous racing car',
    note: 'my favourite project',
    summary:
      "A 1/10 scale autonomous racing car I designed and built myself, running ROS 2 on an NVIDIA Jetson Orin Nano with LiDAR and a camera. I'm currently finalizing a plug-and-play machine learning system that adds learned perception, learned dynamics correction, and lap-by-lap optimization on top of a geometric baseline.",
    writeup: [
      "This is the project I'm most proud of. I started with a Traxxas Slash 4x4, took out almost everything, and designed and assembled the rest of the car myself. I upgraded the motor to a sensored brushless motor with a programmable VESC controller, moved to 3S LiPo batteries, and added an NVIDIA Jetson Orin Nano, an RPLIDAR C1 LiDAR, and a global-shutter camera for computer vision.",
      'I also designed the power system and wired and soldered everything together. The Jetson, the motor, and the safety system each get their own power rail, and a hardware kill switch (an RP2040 safety mux with level shifters) can cut the motor from my RC remote even if the Jetson freezes. Nothing in the software is allowed to bypass it.',
      'The software runs on ROS 2, split into 15 packages. I started with the classic control algorithms: gap following, wall following, and pure pursuit, all in C++, plus a safety node that brakes based on time to collision. Gap following gave the car its first working laps on the floor.',
      "The best part is the system I'm finalizing now: a plug-and-play machine learning stack. It starts from a baseline geometric perception algorithm that turns each LiDAR scan into a local map of the track, then adds 3 learned components: learned perception, learned dynamics correction, and lap-by-lap optimization. Every part can be swapped against its classical version, so I can measure exactly what the learning adds. So far the car has done 9 mapless runs (about 170 m) on the geometric baseline with zero wall contact. The learned perception model cut centreline error from 0.136 m to 0.051 m on held-out runs, and the learned dynamics correction reduced yaw error to 0.40x of the physics model alone.",
      'The camera already counts laps on the real car (20 out of 20 in testing). I also incorporated image detection for practical tasks, such as delivering medicine to seniors and detecting crime with a "spider-bot" patrol mode.',
      'Before this car, I trained SAC and PPO agents from scratch in the F1TENTH simulator. A residual SAC policy running on top of pure pursuit lapped the Spielberg track in 33.40 s, compared to 37.99 s for pure pursuit on its own.',
    ],
    tags: ['ROS 2', 'C++', 'Python', 'PyTorch', 'Jetson', 'LiDAR'],
    stack: [
      'ROS 2 Humble, C++, Python',
      'PyTorch, YOLOv8, MPPI planner',
      'Jetson Orin Nano, VESC, RPLIDAR C1, RP2040 safety mux',
    ],
    art: 'car',
    repo: 'https://github.com/cameronjim/fast-car',
    featured: true,
  },
  {
    slug: 'hawkeye',
    title: 'Hawkeye',
    note: '3D game in Unreal Engine 5',
    summary:
      "A third-person action game I'm making solo in Unreal Engine 5 and C++, in the style of Insomniac's Spider-Man games. You play as Kate Bishop, with a bow, a grapple arrow, and a lot of parkour.",
    writeup: [
      "Hawkeye is a third-person action game I'm building solo in Unreal Engine 5 with C++. I've always wanted to learn how games like Insomniac's Spider-Man are made, so I'm making one in that style. I designed it, wrote the story, and built the gameplay. You play as Kate Bishop, with a bow, a grapple arrow, and a dog in a sweater.",
      "Kate doesn't have webs to swing on, so getting around is parkour and a grapple arrow. Both run on a custom movement component, which means every zip and vault is real movement with real velocity. You keep your speed going into a zip, and you land running.",
      'Combat is built around groups of thugs, like in Spider-Man. An attack token system decides who is allowed to swing, so two enemies never hit you from the same side at once, and there is always a parry or a dodge that gets you out of it.',
      'The city is NOT hand-built. A Python pipeline reads OpenStreetMap data for the blocks around Tompkins Square Park in New York and generates the buildings, ledges, fire escapes, and grapple points. As a result, every street-facing roof can be reached with the grapple from the street.',
      "It's still a prototype: one district and one chapter, with stand-in characters and mostly flat colours. That is on purpose, since traversal had to feel right before anything else. I work with Claude Code as a pair on this project. I set the design and the story, play every build, and decide what changes, and about 500 automated tests run on every change.",
      'This is a fan project. It is not affiliated with Marvel, Disney, or Insomniac Games, and nothing here is for sale.',
    ],
    tags: ['Unreal Engine 5', 'C++', 'Python'],
    stack: [
      'Unreal Engine 5, C++',
      'Python city generator using OpenStreetMap data',
      'About 500 automated tests, run in CI',
    ],
    art: 'eye',
    repo: 'https://github.com/cameronjim/hawkeye',
  },
  {
    slug: 'gameboy-emulator',
    title: 'Game Boy Color emulator',
    note: 'plus four games I wrote for it',
    summary:
      'A Game Boy Color emulator I wrote from scratch in C++, plus my own versions of Super Mario Bros, Tetris, Flappy Bird, and Crossy Road written in C. It runs on Windows, Mac, Linux, and in your browser.',
    writeup: [
      'I wrote a Game Boy Color emulator from scratch in C++, including the CPU, memory, graphics, timers, audio, and support for MBC1, MBC3, and MBC5 cartridges. It runs on Windows, Mac, and Linux, and it plays both original Game Boy and Game Boy Color games. I check it against test ROMs from the Mooneye and blargg test suites.',
      'To have something to play on it, I also reverse engineered four games and rewrote them from scratch in C with gbdk-2020: Super Mario Bros, Tetris, Flappy Bird, and Crossy Road. Tetris gives each piece its own colour and saves your best score, and Super Mario Bros is a rebuild of World 1 with four levels, powerups, and a boss fight.',
      "The same emulator runs in the browser too. Every push to main builds it with Emscripten and publishes it, which is what you can play right here on my site. Saves are kept in your browser, so they survive a reload.",
    ],
    tags: ['C++', 'C', 'SDL2', 'gbdk-2020', 'Emscripten'],
    stack: ['C++, CMake, SDL2', 'C and gbdk-2020 for the games', 'Emscripten for the browser build'],
    art: 'gameboy',
    repo: 'https://github.com/cameronjim/gbemu',
    live: PLAY_URL,
    liveLabel: 'play it',
    screenshots: [
      { src: '/projects/gbemu/tetris.png', caption: 'Tetris' },
      { src: '/projects/gbemu/crossy-road.png', caption: 'Crossy Road' },
      { src: '/projects/gbemu/flappy-bird.png', caption: 'Flappy Bird' },
      { src: '/projects/gbemu/mario.png', caption: 'Super Mario Bros' },
    ],
  },
  {
    slug: 'nba-iq',
    title: 'NBA IQ',
    note: 'built for my fantasy leagues',
    summary:
      'A machine learning NBA analytics platform I built for my fantasy leagues. Its player stat predictions are 16% more accurate than a season-average baseline.',
    writeup: [
      'I built NBA IQ for my own fantasy NBA leagues. It is a full-stack analytics platform with machine learning at the centre: a scraping pipeline feeds box scores, odds, stats, and injuries into PostgreSQL, and the models run on top of that.',
      "Player production is split into 3 separate predictors, trained on over 170,000 player-games. As a result, its player stat predictions are 16% more accurate than a season-average baseline. There is also an AI assistant that reads your roster and suggests trades and waiver moves.",
    ],
    tags: ['LightGBM', 'React', 'Postgres', 'AWS'],
    stack: [
      'Python, LightGBM, pandas',
      'React, TypeScript, Vite, Tailwind CSS, daisyUI',
      'Node.js, Express, PostgreSQL, Neon',
      'AWS Lambda, API Gateway, S3, CloudFront, CI/CD',
      'Vitest, Playwright, pytest',
    ],
    art: 'basketball',
    repo: 'https://github.com/cameronjim/nba-iq',
    live: 'https://nbaiq.cameronjim.com',
    liveLabel: 'open the app',
  },
  {
    slug: 'rv32-core',
    title: 'rv32-core',
    note: 'a CPU, from scratch',
    summary:
      'A RISC-V RV32I processor designed in SystemVerilog and running real machine code on a Cyclone V FPGA.',
    writeup: [
      'A RISC-V RV32I CPU designed from scratch in SystemVerilog and synthesized onto a Cyclone V FPGA (DE1-SoC). It runs real machine code on physical hardware through a 5-stage pipeline: fetch, decode, execute, memory and writeback.',
      'It implements the full RV32I instruction set, with memory-mapped I/O to the board\'s LEDs, displays, switches and buttons.',
    ],
    tags: ['SystemVerilog', 'FPGA', 'RISC-V'],
    stack: ['SystemVerilog, Quartus Prime, Cyclone V FPGA', 'Icarus Verilog, GTKWave'],
    art: 'chip',
    repo: 'https://github.com/cameronjim/rv32-core',
  },
  {
    slug: 'nullsh',
    title: 'nullsh',
    note: 'zero dependencies',
    summary:
      'A Unix shell in C17 with its own lexer, parser, job control and a custom malloc replacement.',
    writeup: [
      'A Unix shell written in C17 with no dependencies, built to learn how the pieces really work. Its lexer, parser and executor are implemented from scratch.',
      'It has job control with process groups and signal handling, and a custom memory allocator that replaces malloc (first-fit and buddy). It also ships an ELF inspector, a CHIP-8 emulator and a raw-socket packet monitor.',
    ],
    tags: ['C17', 'Unix', 'systems'],
    stack: [
      'C17, GNU Make',
      'Custom allocator, job control, signal handling',
      'ELF parser, CHIP-8 emulator, packet decoder',
    ],
    art: 'terminal',
    repo: 'https://github.com/cameronjim/nullsh',
  },
  {
    slug: 'cubetimer',
    title: 'Cubetimer',
    note: 'for speedcubers',
    summary:
      'A terminal speedcube timer in Rust with WCA-style averages, a trend graph and csTimer import/export.',
    writeup: [
      'A speedcube timer built for speedcubers and engineers. It is written in Rust with ratatui for the UI, and has WCA-style averages, a trend graph and full csTimer import/export compatibility.',
    ],
    tags: ['Rust', 'ratatui'],
    stack: ['Rust, ratatui'],
    art: 'cube',
    repo: 'https://github.com/cameronjim/tui-cube-timer',
  },
  {
    slug: 'this-site',
    title: 'This website',
    note: 'drawn in code',
    summary:
      'Hand-drawn SVG art on React, served from S3 and CloudFront, with optional tracked links for applications.',
    writeup: [
      'Every drawing on this site is hand-tuned SVG, wobbled with a displacement filter and inked in on scroll. It is written in React and TypeScript with Tailwind and daisyUI.',
      'Under the hood it runs on AWS: S3 and CloudFront for the site, and Lambda, API Gateway and DynamoDB for tailored, tracked links I send with applications. A GitHub Actions workflow deploys on merge to main using OIDC credentials.',
    ],
    tags: ['React', 'SVG', 'AWS'],
    stack: [
      'React, TypeScript, Vite, Tailwind CSS, daisyUI',
      'AWS Lambda, API Gateway, DynamoDB, CloudFront, S3',
      'GitHub Actions, OIDC',
    ],
    art: 'browser',
    repo: 'https://github.com/cameronjim/bio-site',
  },
]

export function findProject(slug: string | undefined) {
  return PROJECTS.find((project) => project.slug === slug)
}
