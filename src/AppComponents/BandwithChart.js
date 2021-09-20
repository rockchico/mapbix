
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



const BandwithChart = ({ historyData = {}, title, downloadColor = '#82ca9d', uploadColor = '#8884d8', downloadItem = null, uploadItem = null, height = 300 }) => {

    const uploadHistory = historyData[uploadItem] || [];
    const downloadHistory = historyData[downloadItem] || [];

    const networkData = downloadHistory.map((d, id) => {

        const chartItem = {
            name: d.clock,
            time: new Date(d.clock * 1000).getTime(), // converte uniTimestamp 
            nd: downloadHistory[id]?.value,
            nu: uploadHistory[id]?.value
        }

        return chartItem

    })


    const maxU = _.maxBy(networkData, 'nu')?.nu;
    const minU = _.minBy(networkData, 'nu')?.nu;
    const avgU = _.meanBy(networkData, 'nu');
    const lastU = networkData[0]?.nu;

    const maxD = _.maxBy(networkData, 'nd')?.nd;
    const minD = _.minBy(networkData, 'nd')?.nd;
    const avgD = _.meanBy(networkData, 'nd');
    const lastD = networkData[0]?.nd;




    const CustomLegend = (props) => {

        return (
            <>
                <span style={{ color: uploadColor, fontSize: 12, margin: 0, padding: 0 }}>
                    Upload - last: {formatBytes(lastU, 2)} min: {formatBytes(minU, 2)} avg: {formatBytes(avgU, 2)} max: {formatBytes(maxU, 2)}
                </span>
                <br />
                <span style={{ color: downloadColor, fontSize: 12, margin: 0, padding: 0 }}>
                    Download - last: {formatBytes(lastD, 2)} min: {formatBytes(minD, 2)} avg: {formatBytes(avgD, 2)} max: {formatBytes(maxD, 2)}
                </span>
            </>
        );
    }


    return (
        <>
            <Text alignSelf='center'>{title}</Text>
            <ResponsiveContainer width="100%" height={height}>
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
                            <stop offset="5%" stopColor={uploadColor} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={uploadColor} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={downloadColor} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={downloadColor} stopOpacity={0} />
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
                        tickFormatter={(bytes) => formatBytes(bytes, 0)}
                        tick={{ fontSize: 10 }}
                    />
                    <Tooltip
                        formatter={(value, name) => {
                            return [
                                formatBytes(value, 2),
                                //value,
                                (name == 'nd' ? 'Down' : 'Up')
                            ]
                        }}
                        labelFormatter={(value) => moment(value).format('HH:mm:ss')}
                    />


                    <Area
                        type="monotone"
                        dataKey="nu"
                        stackId="1"
                        stroke={uploadColor}
                        fillOpacity={1}
                        fill="url(#colorUv)"
                    />

                    <Area
                        type="monotone"
                        dataKey="nd"
                        stackId="2"
                        stroke={downloadColor}
                        fillOpacity={1}
                        fill="url(#colorPv)"
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
const memoized = memo(BandwithChart)

export default memoized