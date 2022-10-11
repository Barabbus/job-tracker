import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts'

const AreaChartComponent = ({ data }) => {
  return (
      <ResponsiveContainer width='100%' height={350}>
          <AreaChart data={data} margin={{ top: 40 }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Area type='monotone' dataKey='count' stroke='#0082ff' fill='#00beff' />
          </AreaChart>
      </ResponsiveContainer>
  )
}

export default AreaChartComponent