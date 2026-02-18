import classNames from 'classnames'
import './NutriScore.css'

interface NutriScoreProps {
  score: string
  showLabel?: boolean
}

export const NutriScore = ({ score, showLabel = false }: NutriScoreProps) => (
  <span className={classNames('nutri-score', `nutri-score--${score.toLowerCase()}`)}>
    {showLabel && 'Nutriscore: '}
    {score}
  </span>
)