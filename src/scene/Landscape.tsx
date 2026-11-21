import { useMemo } from 'react'
import type { MotionValue } from 'framer-motion'
import { DEPTH } from './cameraConfig'
import { LANDSCAPE } from './landscapeConfig'
import { treeSources, treeSymbolMarkup } from './landscapeGenerate'
import { useLandscapeGeometry } from './hooks'
import MountainLayer from './MountainLayer'
import MistLayer from './MistLayer'
import TreeLayer from './TreeLayer'

interface LandscapeProps {
  progress: MotionValue<number>
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  compact: boolean
  /** Dev seed — regenerates ridges + tree scatter when it changes. */
  seed?: number
}

/**
 * Background planes, far → near: ridges, mist and the far/mid tree bands.
 * The near tree band + green ground + camp live together in Foreground so
 * they share a single transform. Each plane here gets its own depth-driven
 * scroll transform; pointer drift lives on an outer wrapper in DepthLayer.
 */
export default function Landscape({
  progress,
  mouseX,
  mouseY,
  compact,
  seed = LANDSCAPE.seed,
}: LandscapeProps) {
  const geom = useLandscapeGeometry(seed, compact)

  const symbols = useMemo(() => {
    // Keep all three ids: the near symbol is consumed by Foreground.
    const used = new Set([
      LANDSCAPE.trees.far.symbolId,
      LANDSCAPE.trees.mid.symbolId,
      LANDSCAPE.trees.near.symbolId,
    ])
    return treeSources()
      .filter((s) => used.has(s.id))
      .map((s) => ({
        id: s.id,
        markup: treeSymbolMarkup(s.raw),
        viewBox: `0 0 ${s.vbW} ${s.vbH}`,
      }))
  }, [])

  const mistBands = compact ? geom.mist.slice(0, 1) : geom.mist

  return (
    <g className="scene-landscape" aria-hidden="true">
      <defs>
        {symbols.map((s) => (
          <symbol key={s.id} id={s.id} viewBox={s.viewBox} fill="currentColor">
            <g dangerouslySetInnerHTML={{ __html: s.markup }} />
          </symbol>
        ))}
      </defs>

      {/* Far → near ridges (mobile drops the farthest one). */}
      {!compact && (
        <MountainLayer
          progress={progress}
          mouseX={mouseX}
          mouseY={mouseY}
          depth={DEPTH.ridgeFar}
          fillVar="var(--mtn-a)"
          d={geom.mountains.a}
          className="scene-ridge-a"
        />
      )}
      <MountainLayer
        progress={progress}
        mouseX={mouseX}
        mouseY={mouseY}
        depth={DEPTH.ridgeMid}
        fillVar="var(--mtn-b)"
        d={geom.mountains.b}
        className="scene-ridge-b"
      />
      <MistLayer progress={progress} mouseX={mouseX} mouseY={mouseY} bands={mistBands} />
      <MountainLayer
        progress={progress}
        mouseX={mouseX}
        mouseY={mouseY}
        depth={DEPTH.ridgeNear}
        fillVar="var(--mtn-c)"
        d={geom.mountains.c}
        className="scene-ridge-c"
      />

      {/* Tree bands behind the camp (near band lives in Foreground). */}
      {!compact && (
        <TreeLayer
          progress={progress}
          mouseX={mouseX}
          mouseY={mouseY}
          depth={DEPTH.treeFar}
          className="scene-trees--far"
          fillVar="var(--trees-far)"
          groundFillVar="var(--trees-far)"
          groundD={geom.trees.far.ground}
          trees={geom.trees.far.trees}
        />
      )}
      <TreeLayer
        progress={progress}
        mouseX={mouseX}
        mouseY={mouseY}
        depth={DEPTH.treeMid}
        className="scene-trees--mid"
        fillVar="var(--trees-mid)"
        groundFillVar="var(--trees-mid)"
        groundD={geom.trees.mid.ground}
        trees={geom.trees.mid.trees}
      />

      {/* Dark valley floor behind the camp — wide/tall enough to never edge. */}
      <MountainLayer
        progress={progress}
        mouseX={mouseX}
        mouseY={mouseY}
        depth={DEPTH.ground}
        fillVar="var(--ground)"
        d={geom.mountains.ground}
        className="scene-ground"
      />
    </g>
  )
}
