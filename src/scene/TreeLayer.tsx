import DepthLayer from './DepthLayer'
import type { MotionValue } from 'framer-motion'
import type { TreeInstance } from './landscapeGenerate'

interface TreeLayerProps {
  progress: MotionValue<number>
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  depth: number
  /** Extra class used by the atmospheric-perspective colour rules. */
  className: string
  fillVar: string
  /** Solid ground-fill colour (same depth as the trees). */
  groundFillVar: string
  /** Closed ground path the trees are rooted to (from the generator). */
  groundD: string
  trees: TreeInstance[]
}

/**
 * One depth of silhouettes on a tilted valley wall: solid ground path
 * (follows config tilt) + capped <use> instances of that layer's single tree.
 * The whole band shares one scroll transform via DepthLayer.
 */
export default function TreeLayer({
  progress,
  mouseX,
  mouseY,
  depth,
  className,
  fillVar,
  groundFillVar,
  groundD,
  trees,
}: TreeLayerProps) {
  return (
    <DepthLayer
      progress={progress}
      mouseX={mouseX}
      mouseY={mouseY}
      depth={depth}
      className={`scene-trees ${className}`}
      color={fillVar}
    >
      <path d={groundD} fill={groundFillVar} className="scene-tree-ground" />
      {trees.map((tree, i) => (
        <use
          key={`${tree.symbolId}-${i}`}
          href={`#${tree.symbolId}`}
          x={tree.x - tree.w / 2}
          y={tree.y - tree.h}
          width={tree.w}
          height={tree.h}
        />
      ))}
    </DepthLayer>
  )
}
