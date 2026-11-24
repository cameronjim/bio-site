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
    title: 'Autonomous 1/10-scale race car',
    note: 'it drives itself',
    summary:
      'Built the car from the chassis up, wrote the microcontroller firmware, then trained SAC and PPO agents to drive it fast. Runs on ROS 2 with an independent LiDAR safety layer.',
    writeup: [
      'A full-stack project spanning simulation and hardware. I built a custom 1/10-scale racing car with sensors, motors, an NVIDIA Jetson and a chassis, and wrote the firmware for its microcontrollers.',
      'I trained SAC and PPO agents from scratch against the F1TENTH Gym for pure speed, upgrading an existing pure pursuit controller I had. The model runs on a ROS 2 stack with an independent LiDAR safety layer for emergency braking.',
    ],
    tags: ['ROS 2', 'PyTorch', 'LiDAR', 'Jetson', 'C++'],
    stack: ['Python, C++, C, ROS 2, F1TENTH Gym, NVIDIA Jetson', 'PyTorch, SAC, PPO'],
    art: 'car',
    repo: 'https://github.com/cameronjim/fast-car',
    featured: true,
  },
  {
    slug: 'hawkeye',
    title: 'Hawkeye',
    note: '3D game',
    summary: 'A 3D game I built. Demo video and full write-up coming soon.',
    writeup: ['The full write-up for Hawkeye, my 3D game, is on its way, along with a demo video.'],
    tags: [],
    stack: [],
    art: 'eye',
    draft: true,
  },
  {
    slug: 'gameboy-emulator',
    title: 'Game Boy Color emulator',
    note: 'plays real cartridges',
    summary:
      'A DMG/CGB emulator written from scratch in C/C++, passing the blargg, Mooneye and acid2 test suites, plus original games I wrote with gbdk-2020.',
    writeup: [
      'A Game Boy Color (DMG/CGB) emulator built from scratch in C/C++ that runs on Windows, macOS and Linux. It implements a full CPU, PPU, APU and cartridge mapper support (MBC1/3/5) for running real commercial ROMs.',
      'It is verified with the same test suites real emulator authors use: blargg, Mooneye and the pixel-exact acid2 tests. I have also written original games from scratch with gbdk-2020, including takes on Tetris, Flappy Bird and Crossy Road.',
    ],
    tags: ['C', 'C++', 'SDL2', 'gbdk-2020'],
    stack: [
      'C, C++, CMake, SDL2, gbdk-2020',
      'Custom CPU/PPU/APU core, MBC1/3/5 cartridge support',
      'blargg, Mooneye, acid2 test suites',
    ],
    art: 'gameboy',
    repo: 'https://github.com/cameronjim/gameboy-emulator',
    live: PLAY_URL,
    liveLabel: 'play it',
    screenshots: [
      { src: '/projects/gbemu/tetris.png', caption: 'Tetris' },
      { src: '/projects/gbemu/crossy-road.png', caption: 'Crossy Road' },
      { src: '/projects/gbemu/flappy-bird.png', caption: 'Flappy Bird' },
      { src: '/projects/gbemu/mario.png', caption: 'Super Mario Bros Deluxe' },
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
