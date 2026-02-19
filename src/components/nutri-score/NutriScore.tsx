import classNames from 'classnames'
import './NutriScore.css'

interface NutriScoreProps {
  score: string
}

export const NutriScore = ({ score }: NutriScoreProps) => (
  <span
    className={classNames('nutri-score', `nutri-score--${score.toLowerCase()}`)}
    aria-label={`Nutriscore: ${score}`}
  >
    {score}
  </span>
)
