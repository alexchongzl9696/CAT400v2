import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import Frame from 'react-frame-component'

import CanvasEngine from '../canvas/CanvasEngine';
import { CANVAS_RENDERING_MODE } from '../../utils/constants';
import BtnRecording from '../shared/BtnRecording';

class AltLiveView extends PureComponent {

    constructor(props) {
        super(props);
    }


    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render () {
        return (
            <>
                <CanvasEngine mode={CANVAS_RENDERING_MODE.AltLiveView} />
                <BtnRecording />
            </>
        )
    }
}

export default AltLiveView
