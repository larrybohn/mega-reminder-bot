import React, { Component } from 'react';
export const Pager = (props) => {
    const renderPages = () => {
        let elements = [];
        for (let i=1; i<=props.totalPages; ++i) {
            elements.push(
                <li key={i} className={(props.currentPage === i ? 'active ' : '') + 'page-item'}>
                    <button type="button" className="page-link" onClick={() => props.onPageClick(i)}>
                        {i}
                    </button>
                </li>
            );
        }
        return elements;
    };


    return (
        <nav>
            <ul className="pagination">
                <li className={'page-item' + (props.currentPage===1?' disabled':'')}>
                    <button type="button" className="page-link" onClick={() => props.onPageClick(props.currentPage-1)}>Previous</button>
                </li>
                {renderPages()}
                <li className={'page-item' + (props.currentPage===props.totalPages?' disabled':'')}>
                    <button type="button" className="page-link" onClick={() => props.onPageClick(props.currentPage+1)}>Next</button>
                </li>
            </ul>
        </nav>
    );
};

export default Pager;