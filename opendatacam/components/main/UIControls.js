import React, { Component } from 'react'
import { connect } from 'react-redux';
import SVG from 'react-inlinesvg';

import { MODE } from '../../utils/constants';
import { setMode, startRecording, stopRecording, showMenu } from '../../statemanagement/app/AppStateManagement';
import BtnRecording from '../shared/BtnRecording';

// Testing change mode
// const config = require('./config.json');
// const YOLO = require('./server/processes/YOLO');
// const SIMULATION_MODE = process.env.NODE_ENV !== 'production'; // When not running on the Jetson
// Test end

class UIControls extends Component {

  constructor(props) {
    super(props);
    this.handleLoadClick = this.handleLoadClick.bind(this);
  }

  // handleStartRecording() {
  //   this.props.dispatch(startCounting());
  // }

  handleColorClick(){
    console.log('color clicked')
  }

  handleTypeCLick(){
    console.log('type clicked')
  }

  handleESclick(){
    console.log('ES clicked')
    const { Client } = require('@elastic/elasticsearch')
    const client = new Client({ node: 'http://localhost:9200' })

    async function run () {
      // Let's start by indexing some data
      await client.index({
        index: 'game-of-thrones',
        // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
        body: {
          character: 'Ned Stark',
          quote: 'Winter is coming.'
        }
      })

      await client.index({
        index: 'game-of-thrones',
        // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
        body: {
          character: 'Daenerys Targaryen',
          quote: 'I am the blood of the dragon.'
        }
      })

      await client.index({
        index: 'game-of-thrones',
        // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
        body: {
          character: 'Tyrion Lannister',
          quote: 'A mind needs books like a sword needs a whetstone.'
        }
      })

      // here we are forcing an index refresh, otherwise we will not
      // get any result in the consequent search
      await client.indices.refresh({ index: 'game-of-thrones' })

      // Let's search!
      const { body } = await client.search({
        index: 'game-of-thrones',
        // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
        body: {
          query: {
            match: { quote: 'winter' }
          }
        }
      })

      console.log(body.hits.hits)
    }

    run().catch(console.log)
  }

  handleLoadClick() {
    let fullFileName = 'null';
    let fname = 'null';

    console.log('test load button');

    document.getElementById('file').onchange = function () {
      fullFileName = this.value.split("\\").reverse()[0];
      console.log('Selected file: ' + fullFileName);
      // let rawdata = fs.readFileSync('/home/wysetime/CAT400/opendatacam/config.json');
      // let jsonData = JSON.parse(rawdata);
      // jsonData.VIDEO_INPUTS_PARAMS.file = fullFileName;
    };

    this.refs.fileSelector.click();
  }

  render () {

    if(this.props.recordingStatus.isRecording) {
      var diff = Math.abs(new Date(this.props.recordingStatus.dateStarted) - new Date());
      var seconds = Math.floor(diff/1000) % 60;
      var minutes = Math.floor((diff/1000)/60);
    }

    return (
      <React.Fragment>
        <div className="loadBtn">
            <input type="file" id="file" ref="fileSelector" style={{display: "none"}}/>
        </div>
        <div className="nav">
          {this.props.recordingStatus.isRecording &&
            <div className="recording-bar"></div>
          }
          <div className="recording-status">
            {this.props.recordingStatus.isRecording &&
              <div className="time text-lg mb-1 font-bold">{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</div>
            }
            {/*Removed fps*/}
            {/*<div className="fps">{this.props.recordingStatus.currentFPS} FPS</div>*/}
          </div>
          <div className="flex">
            <div className="nav-left mt-2 ml-2 shadow flex">
              <button
                className={`btn btn-default rounded-l ${this.props.mode === MODE.LIVEVIEW ? 'btn-default--active' : ''} ${!this.props.uiSettings.get('pathfinderEnabled') && !this.props.uiSettings.get('counterEnabled') ? 'rounded-r': ''}`}
                // className={`btn ${this.props.mode === MODE.LIVEVIEW ? 'btn-default--active' : ''} ${!this.props.uiSettings.get('pathfinderEnabled') && !this.props.uiSettings.get('counterEnabled') ? 'rounded-r': ''}`}
                onClick={() => this.props.dispatch(setMode(MODE.LIVEVIEW))}
              >
                Classify
              </button>
              <button
                  className={`btn btn-default rounded-l`}
                  // onClick={() => this.handleESclick()}
              >
                ES
              </button>
              {this.props.uiSettings.get('counterEnabled') &&
              (!this.props.recordingStatus.isRecording || this.props.isAtLeastOneCountingAreasDefined) &&
                <button
                  className={`btn btn-default border-r border-l border-default-soft border-solid ${this.props.mode === MODE.COUNTERVIEW ? 'btn-default--active' : ''} ${this.props.uiSettings.get('pathfinderEnabled') ? '': 'rounded-r'}`}
                  // className={`btn border-default-soft border-solid ${this.props.mode === MODE.COUNTERVIEW ? 'btn-default--active' : ''} ${this.props.uiSettings.get('pathfinderEnabled') ? '': 'rounded-r'}`}
                  onClick={() => this.props.dispatch(setMode(MODE.COUNTERVIEW))}
                >
                  Counter
                </button>
              }
              {/*{this.props.uiSettings.get('pathfinderEnabled') &&*/}
              {/*  <button*/}
              {/*    className={`btn btn-default rounded-r ${this.props.mode === MODE.PATHVIEW ? 'btn-default--active' : ''}`}*/}
              {/*    onClick={() => this.props.dispatch(setMode(MODE.PATHVIEW))}*/}
              {/*  >*/}
              {/*    Trajectory*/}
              {/*  </button>*/}
              {/*}*/}
              {/*<button*/}
              {/*    className={`btn btn-default rounded-l `}*/}
              {/*    // onClick={() => this.props.dispatch(setMode(MODE.LIVEVIEW))}*/}
              {/*    onClick={() => this.handleColorClick()}*/}
              {/*>*/}
              {/*  Color*/}
              {/*</button>*/}
              {/*<button*/}
              {/*    className={`btn btn-default rounded-l`}*/}
              {/*    // onClick={() => this.props.dispatch(setMode(MODE.LIVEVIEW))}*/}
              {/*    onClick={() => this.handleTypeCLick()}*/}
              {/*>*/}
              {/*  Type*/}
              {/*</button>*/}
            </div>
            {/*comment this section*/}
            <div className="nav-right mt-2 mr-2 flex">
              <button
                className={`btn btn-default shadow rounded-l ${this.props.mode === MODE.DATAVIEW ? 'btn-default--active' : ''}`}
                onClick={() => this.props.dispatch(setMode(MODE.DATAVIEW))}
              >
                Data
              </button>
              <button
                className={`btn btn-default shadow rounded-r border-l border-default-soft border-solid ${this.props.mode === MODE.CONSOLEVIEW ? 'btn-default--active' : ''}`}
                onClick={() => this.props.dispatch(setMode(MODE.CONSOLEVIEW))}
              >
                Console
              </button>
              <button
                className={`btn btn-default shadow ml-2 py-0 px-3 rounded border border-default-soft border-solid`}
                onClick={() => this.props.dispatch(showMenu())}
              >
                <SVG
                  className="w-5 h-5 svg-icon flex items-center"
                  cacheGetRequests={true}
                  src={`/static/icons/ui/menu.svg`}
                  aria-label="icon menu"
                />
              </button>
            </div>
            {/*comment this section*/}
          </div>
        </div>
        <style jsx>{`
          .nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 3;
          }

          .nav-right {
            position: absolute;
            right: 0;
          }

          .recording-bar {
            background-color: #FF0000;
            text-align: center;
            width: 100%;
            z-index: 3;
            height: 0.32rem;
          }

          .recording-status {
            position: absolute;
            transform: translateX(-50%);
            margin-left: 50%;
            text-align: center;
            color: #FF0000;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            top: 1rem;
          }
        `}</style>
      </React.Fragment>
    )
  }
}

export default connect((state) => {
  return {
    recordingStatus: state.app.get('recordingStatus').toJS(),
    uiSettings: state.app.get('uiSettings'),
    mode: state.app.get('mode'),
    isAtLeastOneCountingAreasDefined: state.counter.get('countingAreas').size > 0
  }
})(UIControls);
