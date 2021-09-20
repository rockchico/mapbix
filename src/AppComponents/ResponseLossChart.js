
/**
 *  - Chart example
 *  https://codesandbox.io/s/stacked-area-chart-ix341?file=/src/App.tsx 
 * 
 *  - Moving charts example
 * https://codesandbox.io/s/6x979p8rr3?from-embed=&file=/src/index.js
 * 
 * - formater unixdate
 * https://github.com/recharts/recharts/issues/956
 */
import React, { memo } from "react";
import _ from "lodash";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { Box, Text } from 'grommet';
import moment from 'moment'

import { formatBytes } from 'AppUtils/index'


const ResponseLossChart = ({ historyData = {}, title, responseColor = '#82ca9d', lossColor = '#8884d8', responseItem = null, lossItem = null }) => {



    const responseHistory = historyData[responseItem] || [];
    const lossHistory = historyData[lossItem] || [];

    const networkData = responseHistory.map((d, id) => {

        const chartItem = {
            name: d.clock,
            time: new Date(d.clock * 1000).getTime(), // converte uniTimestamp 
            nr: responseHistory[id]?.value * 1000,
            nl: lossHistory[id]?.value
        }

        return chartItem

    })


    const maxResponse = _.maxBy(networkData, 'nr')?.nr?.toFixed(2);
    const minResponse = _.minBy(networkData, 'nr')?.nr?.toFixed(2);
    const avgResponse = _.meanBy(networkData, 'nr')?.toFixed(2);
    const lastResponse = networkData[0]?.nr?.toFixed(2);


    const maxLoss = _.maxBy(networkData, 'nl')?.nl?.toFixed(2);
    const minLoss = _.minBy(networkData, 'nl')?.nl?.toFixed(2);
    const avgLoss = _.meanBy(networkData, 'nl')?.toFixed(2);
    const lastLoss = networkData[0].nl?.toFixed(2);


    const CustomLegend = (props) => {

        return (
            <>
                <span style={{ color: lossColor, fontSize: 12, margin: 0, padding: 0 }}>
                    Perda - last: {`${lastLoss}%`} min: {`${minLoss}%`} avg: {`${avgLoss}%`} max: {`${maxLoss}%`}
                </span>
                <br />
                <span style={{ color: responseColor, fontSize: 12, margin: 0, padding: 0 }}>
                    Tempo de Resposta - last: {`${lastResponse}ms`} min: {`${minResponse}ms`} avg: {`${avgResponse}ms`} max: {`${maxResponse}ms`}
                </span>
            </>
        );
    }


    return (
        <>
            <Text>{title}</Text>
            <ResponsiveContainer width="100%" height={320}>
                <AreaChart
                    data={networkData}
                    margin={{
                        top: 20,
                        right: 20,
                        left: 0,
                        bottom: 20
                    }}
                >

                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={lossColor} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={lossColor} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={responseColor} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={responseColor} stopOpacity={0} />
                        </linearGradient>
                    </defs>



                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        tickFormatter={(time) => moment(time).format('HH:mm')}
                        type='number'
                        scale='time'
                        //domain={['dataMin', 'dataMax']}
                        domain={['auto', 'auto']}
                        //interval='preserveStartEnd'
                        minTickGap={10}
                        tickMargin={10}
                        //reversed={true}
                        //tick={false}
                        tick={{ fontSize: 10 }}
                        color='white'
                    //tickCount={6}
                    />
                    <YAxis
                        yAxisId='left'
                        tickFormatter={(responseTime) => `${responseTime}ms`}
                        tick={{ fontSize: 10 }}
                        color={responseColor}
                    />
                    <YAxis
                        yAxisId='right'
                        orientation='right'
                        tickFormatter={(percentLoss) => `${percentLoss}%`}
                        tick={{ fontSize: 10 }}
                        color={lossColor}
                    />
                    <Tooltip
                        formatter={(value, name) => {
                            return [
                                (name == 'nr' ? `${value.toFixed(2)}ms` : `${value}%`),
                                //value,
                                (name == 'nr' ? 'Tempo Resposta' : 'Perda')
                            ]
                        }}
                        labelFormatter={(value) => moment(value).format('HH:mm:ss')}
                    />


                    <Area
                        yAxisId='right'
                        type="monotone"
                        dataKey="nl"
                        stackId="1"
                        stroke={lossColor}
                        fillOpacity={0}
                        fill="url(#colorUv)"
                        activeDot={{ r: 4 }}
                    />

                    <Area
                        yAxisId='left'
                        type="monotone"
                        dataKey="nr"
                        stackId="2"
                        stroke={responseColor}
                        fillOpacity={0}
                        fill="url(#colorPv)"
                        activeDot={{ r: 4 }}
                    />

                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        content={CustomLegend}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </>

    );
}

//const last = networkData[networkData.length - 1]

function moviePropsAreEqual(prevMovie, nextMovie) {
    return prevMovie.title === nextMovie.title
        && prevMovie.releaseDate === nextMovie.releaseDate;
}

//const memoized = memo(StackedChart, moviePropsAreEqual)
const memoized = memo(ResponseLossChart)

export default memoized