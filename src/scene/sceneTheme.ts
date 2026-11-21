// Time-of-day scene config: four palettes + per-theme effect/pose switches.
// Every colour the scene paints comes from these values, delivered as CSS
// custom properties on the scene root so switching theme = swapping vars
// (consumers transition `fill`/`stop-color`/`background` over ~1s).

export type SceneThemeId = 'morning' | 'noon' | 'sunset' | 'night'

export interface ScenePalette {
  skyTop: string
  skyBottom: string
  sun: string
  sunGlow: string
  /** Ridge A (farthest) — lightest / haziest. */
  mtnA: string
  mtnB: string
  /** Ridge C (nearest) — darkest. */
  mtnC: string
  /** Tree layers far → near (darkest in front). */
  treesFar: string
  treesMid: string
  treesNear: string
  ground: string
  pine: string
  /** Opaque colour far layers are tinted toward at p=0 (atmospheric haze). */
  haze: string
  /** Fill for the nearest ground plane (drawn in front of the camp). */
  grass: string
  stone: string
  bush: string
  /** Camp grove: greenish-dark canopy + dark brown trunk. */
  foliage: string
  trunk: string
  mist: string
  camp: string
  tent: string
  campAccent: string
  fire: string
  /** Bright inner core of the campfire flame. */
  fireCore: string
  star: string
  /** Night rider: cool indigo ink, darker than the fire-lit air around him. */
  riderNight: string
  /** Night camp chair: bluish-grey, a shade lighter than the rider. */
  chairNight: string
}

// Cycle order for the toggle button.
export const SCENE_THEMES: SceneThemeId[] = ['morning', 'noon', 'sunset', 'night']

// Black + orange brand: orange (--campAccent / --fire) is the constant accent
// in every theme; only the environment shifts.
export const SCENE_PALETTES: Record<SceneThemeId, ScenePalette> = {
  morning: {
    skyTop: '#9fc4e8',
    skyBottom: '#ffe3bb',
    sun: '#fff3d6',
    sunGlow: 'rgba(255, 188, 110, 0.55)',
    mtnA: '#b5c4d4',
    mtnB: '#7d93a8',
    mtnC: '#4a5f74',
    treesFar: '#4a5d6e',
    treesMid: '#2c3b4a',
    treesNear: '#101720',
    ground: '#3d4f61',
    pine: '#2c3b4a',
    haze: '#d9e4ee',
    grass: '#7a9a70',
    stone: '#8e9a9c',
    bush: '#4a6346',
    foliage: '#253b2a',
    trunk: '#3d2a1e',
    mist: 'rgba(255, 255, 255, 0.52)',
    camp: '#1b2530',
    tent: '#85512f',
    campAccent: '#e2582f',
    fire: '#ff9a4d',
    fireCore: '#ffd98a',
    star: '#ffffff',
    riderNight: '#111a26',
    chairNight: '#38434d',
  },
  noon: {
    skyTop: '#5aa7e0',
    skyBottom: '#cfe8f7',
    sun: '#fffdf2',
    sunGlow: 'rgba(255, 255, 235, 0.5)',
    mtnA: '#a3bdcf',
    mtnB: '#6f8fa8',
    mtnC: '#3d5568',
    treesFar: '#3d5a50',
    treesMid: '#2a4540',
    treesNear: '#0d1815',
    ground: '#3a5163',
    pine: '#2a4540',
    haze: '#d3e7f4',
    grass: '#6f9a63',
    stone: '#a3aaa4',
    bush: '#3f6b46',
    foliage: '#223b26',
    trunk: '#3a281c',
    mist: 'rgba(255, 255, 255, 0.22)',
    camp: '#17222c',
    tent: '#8d5a35',
    campAccent: '#e2582f',
    fire: '#ff9a4d',
    fireCore: '#ffd98a',
    star: '#ffffff',
    riderNight: '#101a22',
    chairNight: '#39444a',
  },
  sunset: {
    // Orange dusk with green woods and cool blue-violet shadows — the old
    // maroon/brown mix read muddy instead of like an evening sky.
    skyTop: '#6f88c4',
    skyBottom: '#ffc07a',
    sun: '#ffe2b5',
    sunGlow: 'rgba(255, 150, 80, 0.6)',
    mtnA: '#d9ab88',
    mtnB: '#97899e',
    mtnC: '#655a72',
    treesFar: '#445049',
    treesMid: '#2a3a38',
    treesNear: '#0f1817',
    ground: '#5b4b52',
    pine: '#263348',
    haze: '#f0bb98',
    grass: '#8c9a72',
    stone: '#8d8c8e',
    bush: '#4e6b4d',
    foliage: '#2f4b34',
    trunk: '#3a2b21',
    mist: 'rgba(255, 185, 140, 0.32)',
    camp: '#151626',
    tent: '#7b4028',
    campAccent: '#e2582f',
    fire: '#ff8c42',
    fireCore: '#ffd28a',
    star: '#ffffff',
    riderNight: '#111523',
    chairNight: '#373b4a',
  },
  night: {
    skyTop: '#0b1428',
    skyBottom: '#27406b',
    sun: '#f2f6ff',
    sunGlow: 'rgba(175, 205, 255, 0.45)',
    // Ridges directly behind the camp sit cooler and darker than the rider's
    // indigo ink, so he stays a separate shape instead of merging with them.
    mtnA: '#1b2949',
    mtnB: '#111b36',
    mtnC: '#090e22',
    treesFar: '#1a2947',
    treesMid: '#121d36',
    treesNear: '#070b18',
    ground: '#152140',
    pine: '#0b1028',
    haze: '#42577a',
    grass: '#35515c',
    stone: '#415063',
    bush: '#1b3340',
    foliage: '#0a1522',
    trunk: '#0c1120',
    mist: 'rgba(155, 180, 235, 0.16)',
    camp: '#0a101f',
    tent: '#4e2d20',
    campAccent: '#e2582f',
    fire: '#ff9a4d',
    fireCore: '#ffdc96',
    star: '#e8eeff',
    riderNight: '#111738',
    chairNight: '#39485c',
  },
}

// Which rider pose / prop set each theme mounts (bike stays mounted always).
export type CampPoseId = 'chai' | 'chair' | 'photo' | 'fire'

export const SCENE_POSES: Record<SceneThemeId, CampPoseId> = {
  morning: 'chai',
  noon: 'chair',
  sunset: 'photo',
  night: 'fire',
}

// Lightweight ambient effects per theme — only the active theme mounts these.
export interface SceneEffectsConfig {
  fireflies: number
  stars: boolean
  birds: boolean
  clouds: boolean
  mist: boolean
  embers: boolean
}

export const SCENE_EFFECTS: Record<SceneThemeId, SceneEffectsConfig> = {
  morning: { fireflies: 0, stars: false, birds: true, clouds: false, mist: true, embers: false },
  noon: { fireflies: 0, stars: false, birds: false, clouds: true, mist: false, embers: false },
  sunset: { fireflies: 8, stars: false, birds: true, clouds: false, mist: true, embers: false },
  night: { fireflies: 24, stars: true, birds: false, clouds: false, mist: false, embers: true },
}

// Hour-based default: morning 5–11, noon 12–16, sunset 17–20, night 21–4.
export function hourToSceneTheme(hour: number): SceneThemeId {
  if (hour >= 5 && hour <= 11) return 'morning'
  if (hour >= 12 && hour <= 16) return 'noon'
  if (hour >= 17 && hour <= 20) return 'sunset'
  return 'night'
}

export function nextSceneTheme(current: SceneThemeId): SceneThemeId {
  const index = SCENE_THEMES.indexOf(current)
  return SCENE_THEMES[(index + 1) % SCENE_THEMES.length]
}

// Palette → CSS custom properties applied on the scene root.
export function paletteToCssVars(palette: ScenePalette): Record<string, string> {
  return {
    '--sky-top': palette.skyTop,
    '--sky-bottom': palette.skyBottom,
    '--sun': palette.sun,
    '--sun-glow': palette.sunGlow,
    '--mtn-a': palette.mtnA,
    '--mtn-b': palette.mtnB,
    '--mtn-c': palette.mtnC,
    '--trees-far': palette.treesFar,
    '--trees-mid': palette.treesMid,
    '--trees-near': palette.treesNear,
    '--ground': palette.ground,
    '--pine': palette.pine,
    '--haze': palette.haze,
    '--grass': palette.grass,
    '--stone': palette.stone,
    '--bush': palette.bush,
    '--foliage': palette.foliage,
    '--trunk': palette.trunk,
    '--mist': palette.mist,
    '--camp': palette.camp,
    '--tent': palette.tent,
    '--camp-accent': palette.campAccent,
    '--fire': palette.fire,
    '--fire-core': palette.fireCore,
    '--star': palette.star,
    '--rider-night': palette.riderNight,
    '--chair-night': palette.chairNight,
  }
}
