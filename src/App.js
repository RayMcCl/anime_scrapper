import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Import React Table
import "react-table/react-table.css";
import ReactTable from "react-table";

import AnimeData from './data.json';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: AnimeData.map((data) => {
          data.score = parseFloat(data.score);
          data.rank = parseFloat(data.rank);
          data.episodes = parseFloat(data.episodes);
          data.members = parseFloat(data.members.replace(/,/g, ""));

          data.score = isNaN(data.score) ? 0 : data.score;
          data.rank = isNaN(data.rank) ? 0 : data.rank;
          data.episodes = isNaN(data.episodes) ? 0 : data.episodes;
          data.members = isNaN(data.members) ? 0 : data.members;

          return data;
      })
    };
  }

  render() {
    const { data } = this.state;
    return (
      <div style={{
        textAlign: 'center'
      }}>
        <ReactTable
          getTdProps={(state, rowInfo, column, instance) => {
            return {
              onClick: (e, handleOriginal) => {
                console.log(state, rowInfo, column, instance);
                if(column.id === 'imgPath'){
                  window.open(rowInfo.original.link);
                }

                if (handleOriginal) {
                  handleOriginal()
                }
              }
            }
          }}
          data={data}
          filterable
          columns={[
            {
              Header: "Link",
              accessor: "imgPath",
              width: 75,
              Cell: row => (
                <img
                  src={row.value}
                  style={{
                     cursor: 'pointer'
                  }}
                / >
              )
            },
            {
              Header: "Rank",
              accessor: "rank",
              width: 75
            },
            {
              Header: "Title",
              accessor: "title",
              width: 500,
              Cell: row => (
                <div
                  style={{
                     textAlign: 'left'
                  }}
                >{row.value}
                </div>
              )
            },
            {
              Header: "Score",
              accessor: "score",
              width: 300,
              filterMethod: (filter, row) => {
                  var val = filter.value.split('-');
                  if(val.length > 1){
                    return row[filter.id] > parseFloat(val[0]) && row[filter.id] < parseFloat(val[1]);
                  }

                  return ('' + row[filter.id]).startsWith(filter.value);
              },
              Cell: row => (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#dadada',
                    borderRadius: '2px'
                  }}
                >
                  <div
                    style={{
                      width: `${row.value*10}%`,
                      height: '100%',
                      backgroundColor: row.value*10 > 66 ? '#85cc00'
                        : row.value*10 > 33 ? '#ffbf00'
                        : '#ff2e00',
                      borderRadius: '2px',
                      transition: 'all .2s ease-out',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >{row.value}</div>
                </div>
              )
            },
            {
              Header: "Type",
              accessor: "type"
            },
            {
              Header: "Episodes",
              accessor: "episodes",
              filterMethod: (filter, row) => {
                  var val = filter.value.split('-');
                  if(val.length > 1){
                    return row[filter.id] > parseFloat(val[0]) && row[filter.id] < parseFloat(val[1]);
                  }

                  return ('' + row[filter.id]).startsWith(filter.value);
              }
            },
            {
              Header: "Starting Date",
              accessor: "startingDate",
              filterMethod: (filter, row) => {
                  return row[filter.id].indexOf(filter.value) > -1;
              }
            },
            {
              Header: "Ending Date",
              accessor: "endingDate",
              filterMethod: (filter, row) => {
                  return row[filter.id].indexOf(filter.value) > -1;
              }
            },
            {
              Header: "Members",
              accessor: "members",
              filterMethod: (filter, row) => {
                  var val = filter.value.split('-');
                  if(val.length > 1){
                    return row[filter.id] > parseFloat(val[0]) && row[filter.id] < parseFloat(val[1]);
                  }

                  return ('' + row[filter.id]).startsWith(filter.value);
              }
            }
          ]}
          defaultPageSize={50}
          className="-striped -highlight"
        />
      </div>
    );
  }
}
