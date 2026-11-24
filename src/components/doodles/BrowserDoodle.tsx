import Doodle, { type DoodleProps } from '../sketch/Doodle'

// A browser window with a padlock — this site's own card.
function BrowserDoodle(props: DoodleProps) {
  return (
    <Doodle viewBox="0 0 120 90" {...props}>
      <path pathLength="1" d="M8 8 H112 Q114 8 114 11 V80 Q114 83 111 83 H9 Q6 83 6 80 V10 Q6 8 8 8 Z" />
      <path pathLength="1" d="M6 22 C 40 21, 80 23, 114 22" />
      <circle pathLength="1" cx="16" cy="15" r="2.5" />
      <circle pathLength="1" cx="25" cy="15" r="2.5" />
      <path pathLength="1" d="M38 12 H104 V18 H38 Z" strokeWidth="1.4" />
      <path pathLength="1" d="M18 34 H58 M18 42 H50 M18 50 H54" strokeWidth="1.6" />
      <path pathLength="1" d="M74 52 H98 V72 H74 Z" />
      <path pathLength="1" d="M79 52 V45 Q86 36 93 45 V52" />
      <circle pathLength="1" cx="86" cy="61" r="2.5" />
    </Doodle>
  )
}

export default BrowserDoodle
