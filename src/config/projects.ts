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

export const PLAY_URL = 'https://gb.cameronjim.com'

export const PROJECTS: Project[] = [
  {
    slug: 'race-car',
    title: 'Autonomous 1/10 scale race car',
    note: 'my favourite project',
    summary:
      "I'm turning a Traxxas Slash 4x4 RC truck into a self-driving car that runs ROS 2 on an NVIDIA Jetson Orin Nano. The driving software already handles a simulated copy of the car, and the physical build is happening now.",
    writeup: [
      "This is the project I'm most proud of. I'm converting a Traxxas Slash 4x4 RC truck into a self-driving research car. I kept the stock chassis, drivetrain, suspension, and steering servo, and swapped in a sensored brushless motor with a programmable VESC motor controller. An NVIDIA Jetson Orin Nano runs everything, and a LiDAR is going on next.",
      'Safety comes first on this one. There is a hardware kill switch (an RP2040 and an RC receiver on their own power rail) that can cut the motor even if the Jetson freezes, and nothing in the software is allowed to bypass it.',
      'Before building anything physical, I spent a lot of time in simulation. I trained SAC and PPO agents from scratch in the F1TENTH Gym, with classical controllers like pure pursuit, gap following, and wall following as the baselines they had to beat. On the Spielberg track, a residual SAC policy running on top of pure pursuit lapped in 33.40 s, compared to 37.99 s for pure pursuit on its own.',
      'Right now the motor is sensored and fully controllable from a terminal, and the software stack already drives a simulated copy of this exact car. Next up is getting it driving on a real track. [Anything to add here, like who is helping with the build?]',
    ],
    tags: ['ROS 2', 'PyTorch', 'Jetson Orin Nano', 'C++', 'Python'],
    stack: [
      'ROS 2, Python, C++, Docker',
      'PyTorch, SAC, PPO, F1TENTH Gym',
      'NVIDIA Jetson Orin Nano, VESC, RP2040 kill switch',
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
      "Hawkeye is a third-person action game I'm building solo in Unreal Engine 5 with C++. I've always wanted to learn how games like Insomniac's Spider-Man are made, so I'm making one in that style. You play as Kate Bishop, with a bow, a grapple arrow, and a dog in a sweater.",
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
    title: 'Game Boy emulator',
    note: 'plus four games I wrote for it',
    summary:
      'A Game Boy emulator I wrote from scratch in C++, and four games for it written in C with gbdk-2020: Tetris, Flappy Bird, Crossy Road, and Mario. It runs on Windows, Mac, Linux, and in your browser.',
    writeup: [
      'I wrote a Game Boy (DMG) emulator from scratch in C++, including the CPU, graphics, audio, and support for MBC1, MBC3, and MBC5 cartridges. It runs on Windows, Mac, and Linux, and it can play Game Boy Color games too. I check it against test ROMs from the Mooneye and blargg test suites.',
      'To have something to play on it, I also wrote four games from scratch in C with gbdk-2020. Flappy Bird and Crossy Road are regular Game Boy games, while Tetris and Mario are Game Boy Color builds. Tetris gives each piece its own colour and saves your best score, and Mario is a rebuild of World 1 with four levels, powerups, and a boss fight.',
      "The same emulator runs in the browser too. Every push to main builds it with Emscripten and publishes it, which is what you're playing at gb.cameronjim.com. Saves are kept in your browser, so they survive a reload.",
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
      { src: '/projects/gbemu/mario.png', caption: 'Mario' },
    ],
  },
  {
    slug: 'nba-iq',
    title: 'NBA IQ',
    note: '29 seasons of data',
    summary:
      'Fantasy basketball analytics: a scraping pipeline feeds a 3-model LightGBM system, and an AI assistant reads your roster to suggest trades and waiver moves.',
    writeup: [
      'A full-stack NBA fantasy analytics platform built for reliable projections. A routine scraping pipeline feeds box scores, odds, stats and injuries into Postgres, which runs through a 3-model LightGBM system.',
      'The models are trained on 29 seasons of individual player performance, weight-tuned for accuracy and built to outperform generic LLMs. An AI-powered assistant reads a user\'s roster to come up with the best trades and waiver moves.',
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
