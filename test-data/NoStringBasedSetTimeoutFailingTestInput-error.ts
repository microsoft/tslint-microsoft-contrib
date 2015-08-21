import React = require('react');
import BaseComponent = require('common/component/BaseComponent');
import DateFormatter = require('common/utils/DateFormatter');

/**
 * Flyout to display and modify current filters
 * On single click on an arrow the calendar changes by 1 month
 * On long press (anything longer than 1 second), it changes 1 month every 0.1 seconds
 */
module MonthNavigation {
    'use strict';

    class View extends BaseComponent.BaseComponent<Props, State> {

        private monthTimer: number = null;
        private delayTimeout: number = null;
        private static switchToFastForwardTimeout: number = 1000;
        private static checkIfStillPressedTimeout: number = 100;

        /**
         * Method that will scroll fast through next months
         * ->at current rate we have 10months/sec
         * @method private
         */
        private fastNext(): void {
            clearTimeout(this.monthTimer);
            //at each call wen add one month
            this.props.onMonthSelected(this.props.currentDate.add(1, 'month'));
            //we set an interval at which this function will call itself
            this.delayTimeout = setTimeout(this.fastNext, View.checkIfStillPressedTimeout);
        }

        /**
         * Method that will scroll fast through previous months
         * ->at current rate we have 10months/sec
         * @method private
         */
        private fastPrev(): void {
            clearTimeout(this.monthTimer);
            this.props.onMonthSelected(this.props.currentDate.subtract(1, 'month'));
            this.delayTimeout = setTimeout(this.fastPrev, View.checkIfStillPressedTimeout);
        }

        /**
         * Method that will handle next month actions
         * @method private
         * @param ReactTypes.MouseEvent: mouse event triggered
         */
        private onNextMonthClick(e: ReactTypes.MouseEvent): void {
            e.preventDefault();
            this.props.onMonthSelected(this.props.currentDate.add(1, 'month'));
            //if long pressed we will go faster through the months
            this.monthTimer = setTimeout(this.fastNext, View.switchToFastForwardTimeout);
        }

        /**
         * Method that will handle previous month actions
         * @method private
         * @param ReactTypes.MouseEvent: mouse event triggered
         */
        private onPrevMonthClick(e: ReactTypes.MouseEvent): void {
            e.preventDefault();
            this.props.onMonthSelected(this.props.currentDate.subtract(1, 'month'));
            this.monthTimer = setTimeout(this.fastPrev, View.switchToFastForwardTimeout);
        }

        /**
         * Clear all the timeouts and intervals used
         * @method private
         * @param ReactTypes.MouseEvent: mouse event triggered
         */
        private clearTimeouts(e: ReactTypes.MouseEvent): void {
            //on mouse release or mouse leave we clear all timeouts and intervals.
            clearTimeout(this.delayTimeout);
            clearTimeout(this.monthTimer);
        }

        public render(): ReactTypes.ReactElement<any> {

            return React.jsx(/*
             <div className="DatePicker-MonthNavigation">
             <div className="DatePicker-NextMonth"
             onMouseDown={this.onNextMonthClick}
             onMouseUp={this.clearTimeouts}
             onMouseOut={this.clearTimeouts}
             onTouchStart={this.onNextMonthClick}
             onTouchEnd={this.clearTimeouts}
             />
             <div className="DatePicker-PrevMonth"
             onMouseDown={this.onPrevMonthClick}
             onMouseUp={this.clearTimeouts}
             onMouseOut={this.clearTimeouts}
             onTouchStart={this.onPrevMonthClick}
             onTouchEnd={this.clearTimeouts}
             />

             <div className="DatePicker-CurrentMonth">
             {DateFormatter.asMonthName(this.props.currentDate) + ' ' + DateFormatter.asYear(this.props.currentDate)}
             </div>
             </div>
             */);
        }
    }

    export interface Props extends BaseComponent.Props {
        currentDate: Moment;
        onMonthSelected: (date: Moment) => any;
    }

    export interface State extends BaseComponent.State {
    }

    export var componentClass: ReactTypes.ComponentClass<Props> = BaseComponent.createClass<Props, State>(View);
}
export = MonthNavigation;
