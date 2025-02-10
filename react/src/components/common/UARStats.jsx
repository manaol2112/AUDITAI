import PropTypes from 'prop-types';

export default function UARStatsDisplay({ stats, columns = 3 }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900">Last 30 days</h3>
      <dl className={`mt-5 grid grid-cols-1 gap-5 sm:grid-cols-${columns}`}>
        {stats.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// PropTypes for validation (optional)
UARStatsDisplay.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      stat: PropTypes.string.isRequired,
    })
  ).isRequired,
  columns: PropTypes.number,
};
