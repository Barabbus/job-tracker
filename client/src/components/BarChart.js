import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

const BarChartComponent = ({ data }) => {
  return (
      <ResponsiveContainer width='100%' height={350}>
          <BarChart data={data} margin={{ top: 40 }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey='count' stroke='#0082ff' fill='#00beff' barSize={100} />
          </BarChart>
      </ResponsiveContainer>
  )
}

export default BarChartComponent