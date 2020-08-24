/**
 * @file ColorPickr
 * @author hongfeng(homfen@gmail.com)
 */

import React, {Component} from 'react'
import ColorPicker from 'rc-color-picker'
import Colr from 'colr'
import './ColorPickr.less'

let colr = new Colr()
const colorMode = {
    HEX: 'RGB',
    RGB: 'RGB',
    RGBA: 'RGB',
    HSB: 'HSB', // HSB === HSV
    HSL: 'HSL'
}
const defaultColor = '#ff0000'

export default class ColorPickr extends Component {

    constructor(props) {
        super(props)
        let originalColor = this.props.color || defaultColor
        let alpha = this.props.alpha || 100
        let colorObj = this.getColorFromStr(originalColor)
        let color = colorObj.color.toHex()
        alpha = Math.min(colorObj.alpha, alpha)
        this.timer = 0
        this.state = this.getColor(color, alpha)
        this.state.label = this.props.label
        this.state.textMode = colorObj.textMode || this.props.mode || 'HEX'
        this.state.mode = colorMode[this.state.mode]
        this.state.value = originalColor
    }

    getColor(color, alpha) {
        colr = colr.fromHex(color)
        let rgb = colr.toRgbObject()
        let hsv = colr.toHsvObject()
        let hsl = colr.toHslObject()
        return {
            color,
            alpha,
            rgb,
            hsv,
            hsl
        }
    }
    colorFormat(hexColor, alpha, type) {
        let colorObj = this.getColor(hexColor, alpha)
        switch (type) {
            case 'HEX':
                return colorObj.color
            case 'RGB':
                return `rgb(${colorObj.rgb.r}, ${colorObj.rgb.g}, ${colorObj.rgb.b})`
            case 'RGBA':
                let alpha = colorObj.alpha / 100
                return `rgba(${colorObj.rgb.r}, ${colorObj.rgb.g}, ${colorObj.rgb.b}, ${alpha})`
            case 'HSB':
                return `hsb(${colorObj.hsv.h}, ${colorObj.hsv.s}, ${colorObj.hsv.v})`
            case 'HSL':
                return `hsl(${colorObj.hsl.h}, ${colorObj.hsl.s}, ${colorObj.hsl.l})`
            default:
                return colorObj.color
        }
    }
    onColorChange(colors) {
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            if (colors.color !== this.state.color || colors.alpha !== this.state.alpha) {
                let color = this.getColor(colors.color, colors.alpha)
                let value
                let textMode = this.state.textMode
                if (color.alpha === 100) {
                    value = this.colorFormat(color.color, 100, this.state.textMode)
                }
                else {
                    let alpha = color.alpha / 100
                    value = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${alpha})`
                    textMode = 'RGBA'
                }
                let state = {
                    ...color,
                    value,
                    textMode
                }
                if (textMode === 'HEX') {
                    state.color = value
                }
                this.setState(state)
                this.props.onChange && this.props.onChange(state)
            }
        }, 200)
    }
    onTextClick(event) {
        if (event.shiftKey && this.state.alpha === 100) {
            let keys = Object.keys(colorMode)
            let len = keys.length
            let textMode = keys[(keys.indexOf(this.state.textMode) + 1) % len]
            let mode = colorMode[textMode]
            let value = this.colorFormat(this.state.color, 100, textMode)
            this.setState({value, textMode, mode})
        }
    }
    onTextChange(event) {
        let originValue = event.target.value;
        let value = originValue.replace(/\s/g, '')
        let colorObj = this.getColorFromStr(value)
        if (colorObj) {
            let {color, alpha, textMode} = colorObj
            let rgb = color.toRgbObject()
            let hsv = color.toHsvObject()
            let hsl = color.toHslObject()
            let colors = {
                color: color.toHex(),
                alpha: Math.min(alpha, this.state.alpha, 100),
                rgb,
                hsv,
                hsl
            }
            if (textMode === 'HEX') {
                colors.color = originValue
            }
            this.setState({
                ...colors,
                textMode,
                mode: colorMode[textMode],
                value: originValue
            })
            this.props.onChange && this.props.onChange({...colors, value})
        }
        else {
            this.setState({value: originValue})
        }
    }

    getColorFromStr(colorStr) {
        colorStr = colorStr.replace(/\s/g, '')
        let regHex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
        let regRgb = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/i
        let regRgba = /^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(0(\.\d+)?|1(\.0)?)\)$/i
        let regHsv = /^hsv\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/i
        let regHsl = /^hsl\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/i
        let alpha = 100
        if (regHex.test(colorStr)) {
            return {color: colr.fromHex(colorStr), textMode: 'HEX', alpha}
        }

        let matches
        let color
        let textMode
        if (matches = colorStr.match(regRgb)) {
            color = colr.fromRgbArray(matches.slice(1, 4).map(n => +n))
            textMode = 'RGB'
        }
        else if (matches = colorStr.match(regRgba)) {
            color = colr.fromRgbArray(matches.slice(1, 4).map(n => +n))
            alpha = parseInt(matches[4] * 100, 10)
            textMode = 'RGBA'
        }
        else if (matches = colorStr.match(regHsv)) {
            color = colr.fromHsvArray(matches.slice(1, 4).map(n => +n))
            textMode = 'HSB'
        }
        else if (matches = colorStr.match(regHsl)) {
            color = colr.fromHslArray(matches.slice(1, 4).map(n => +n))
            textMode = 'HSL'
        }
        if (matches) {
            return {color, alpha, textMode}
        }
        return null
    }

    componentWillReceiveProps({color: propsColor, alpha: propAlpha, mode}) {
        if (!propsColor || propsColor === this.state.value) {
            if (propAlpha != null && propAlpha !== this.state.alpha) {
                this.setState({alpha: propAlpha})
            }
            if (mode && mode !== this.state.textMode) {
                this.setState({textMode: mode, mode: colorMode[mode]})
            }
            return
        }
        let value = propsColor.replace(/\s/g, '')
        let colorObj = this.getColorFromStr(value)
        if (colorObj) {
            let {color, alpha} = colorObj
            let rgb = color.toRgbObject()
            let hsv = color.toHsvObject()
            let hsl = color.toHslObject()
            alpha = propAlpha || alpha
            let nextState = {
                color: color.toHex(),
                rgb,
                hsv,
                hsl
            }
            if (mode != null) {
                nextState.textMode = mode
                nextState.mode = colorMode[mode]
            }
            if (alpha != null) {
                nextState.alpha = alpha
            }
            if (colorObj.textMode !== 'HEX') {
                value = this.colorFormat(
                    nextState.color,
                    alpha || this.state.alpha,
                    mode || colorObj.textMode || this.state.textMode)
                nextState.value = value
            }
            this.setState(nextState)
        }
    }

    shouldComponentUpdate(nextProps, {color, alpha, textMode, value}) {
        let {color: stateColor, alpha: stateAlpha, textMode: stateTextMode, value: stateValue} = this.state
        if (stateColor === color && stateAlpha === alpha && stateTextMode === textMode && value === stateValue) {
            return false
        }
        return true
    }

    render() {
        let label = this.state.label
            ? this.state.label
            : '';
        return (
            <div className='property-panel-control ColorPickr'>
                <span className='title'>
                    {label}
                </span>
                <div className='content'>
                    <input
                        className='input'
                        value={this.state.value}
                        onClick={this.onTextClick.bind(this)}
                        onChange={this.onTextChange.bind(this)}
                        title='Shift + Click to change color format'
                    />
                    <span>
                        <ColorPicker
                            color={this.state.color}
                            alpha={this.state.alpha}
                            onChange={this.onColorChange.bind(this)}
                            mode={this.state.mode}
                        />
                    </span>
                </div>
            </div>
        )
    }
}
