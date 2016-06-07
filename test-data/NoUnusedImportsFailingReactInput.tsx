import React = require('react');
import BaseComponent = require('common/component/BaseComponent');
import I18nFacade = require('common/i18n/I18nFacade');

export class AuthorSummary extends BaseComponent.BaseComponent<Props, BaseComponent.State> {

    public render() {
        return <div
            className='AuthorSummary'>
            'some text'
        </div>;
    }
}
