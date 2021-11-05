import './styles.scss';

const PercentCircle = ({ percent }: PercentCircleProps) => {
  // 0% = -289px, 100% = 0
  const strokeDashOffset = -301 * (100 - (percent === null ? 0 : percent)) / 100;

  return (
    <>
      <div className="percent-circle">
        <svg className="percent-circle__svg" viewBox="0 0 100 100" style={{ strokeDashoffset: `${strokeDashOffset}px` }}>
          <circle cx="50" cy="50" r="48" />
        </svg>
        <div className="percent-circle__number">{percent === null ? '?' : `${percent}%`}</div>
        <aside className="percent-circle__tooltip">
          { percent === null ? 'Stocks information is not available for this item' :  (
            <><strong>{percent}%</strong> of stocks are still available</>
          ) }
        </aside>
      </div>
    </>
  );
};

export default PercentCircle;
