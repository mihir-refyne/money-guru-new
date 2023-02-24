import React, { Component } from 'react'
import styles from "./styles.module.css";

const slider = React.createRef<HTMLDivElement>();
const container = React.createRef<HTMLDivElement>();

export default class SwipeableButton extends Component<{ text_unlocked?: string; text?: string; color?: string; onSuccess?: () => void; onFailure?: () => void }> {

    private containerWidth: number = 0;
    private sliderLeft: number = 0;
    private startX: number = 0;
    private unmounted: boolean = false;
    private isDragging: boolean = false;
    private isTouchDevice: boolean = false;

    state: { unlocked?: boolean } = {}

    componentDidMount() {
        this.isTouchDevice = 'ontouchstart' in window.document.documentElement
        if (this.isTouchDevice) {
            document.addEventListener('touchmove', this.onDrag);
            document.addEventListener('touchend', this.stopDrag);
        } else {
            document.addEventListener('mousemove', this.onDrag);
            document.addEventListener('mouseup', this.stopDrag);
        }
        if (container.current)
        this.containerWidth = container.current.clientWidth - 50;
    }

    onDrag = (e: any) => {
        if (this.unmounted || this.state.unlocked) return;
        if (this.isDragging) {
            if (this.isTouchDevice) {
                this.sliderLeft = Math.min(Math.max(0, e.touches[0].clientX - this.startX), this.containerWidth);
            } else {
                this.sliderLeft = Math.min(Math.max(0, e.clientX - this.startX), this.containerWidth);
            }
            this.updateSliderStyle();
        }
    }

    updateSliderStyle = () => {
        if (this.unmounted || this.state.unlocked || !slider.current) return;
        console.log("update")
        slider.current.style.left = (this.sliderLeft + 50) + 'px';
    }

    stopDrag = () => {
        if (this.unmounted || this.state.unlocked) return;
        if (this.isDragging) {
            this.isDragging = false;
            if (this.sliderLeft > this.containerWidth * 0.9) {
                this.sliderLeft = this.containerWidth;
                if (this.props.onSuccess) {
                    this.props.onSuccess();
                    this.onSuccess();
                }
            } else {
                this.sliderLeft = 0;
                if (this.props.onFailure) {
                    this.props.onFailure();
                }
            }
            this.updateSliderStyle();
        }
    }

    startDrag = (e: any) => {
        console.log({ um: this.unmounted, unlck: this.state.unlocked })
        if (this.unmounted || this.state.unlocked) return;
        console.log("drag started")
        this.isDragging = true;
        if (this.isTouchDevice) {
            this.startX = e.touches[0].clientX;
        } else {
            this.startX = e.clientX;
        }
    }

    onSuccess = () => {
        if (!container.current) return;
        container.current.style.width = container.current.clientWidth + 'px';
        this.setState({
            unlocked: true
        })
    }

    getText = () => {
        return this.state.unlocked ? (this.props.text_unlocked || 'UNLOCKED') : (this.props.text || 'SLIDE')
    }

    reset = () => {
        if (this.unmounted) return;
        this.setState({ unlocked: false }, () => {
            this.sliderLeft = 0;
            this.updateSliderStyle();
        });
    }

    // componentWillUnmount() {
    //     this.unmounted = true;
    // }

    render() {
        return (
            <div className={styles.ReactSwipeButton}>
                <div className={styles.rsbContainer + (this.state.unlocked ? styles.rsbContainerUnlocked : '')} ref={container}>
                    <div className={styles.rsbcSlider}
                        ref={slider}
                        onMouseDown={this.startDrag}
                        style={{ background: this.props.color }}
                        onTouchStart={this.startDrag}>
                        <span className={styles.rsbcSliderText}>{this.getText()}</span>
                        <span className={styles.rsbcSliderArrow}></span>
                        <span className={styles.rsbcSliderCircle} style={{ background: this.props.color }}></span>
                    </div>
                    <div className={styles.rsbcText}>{this.getText()}</div>
                </div>
            </div>
        )
    }
}