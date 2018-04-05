import React from 'react';

import {observer} from "mobx-react";

const MIN_PAGES_VISIBLE_PAGINATION = 2;

const ViewDesktop = props => {
    const {pager, setPage} = props;

    return (
        pager.totalPages < MIN_PAGES_VISIBLE_PAGINATION
        ?
        null
        :
        <nav aria-label="Pagination">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${pager.currentPage === 1 ? 'disabled' : ''}`}>
                    <a className="page-link" onClick={() => setPage(1)}>First</a>
                </li>
                <li className={`page-item ${pager.currentPage === 1 ? 'disabled' : ''}`}>
                    <a className="page-link" onClick={() => setPage(pager.currentPage - 1)}>Previous</a>
                </li>
                {
                    pager.pages.map((page, index) =>
                        <li key={index} className={`page-item ${pager.currentPage === page ? 'active' : ''}`}>
                            <a className="page-link" onClick={() => setPage(page)}>{page}</a>
                        </li>
                    )
                }
                <li className={`page-item ${pager.currentPage === pager.totalPages ? 'disabled' : ''}`}>
                    <a className="page-link" onClick={() => setPage(pager.currentPage + 1)}>Next</a>
                </li>
                <li className={`page-item ${pager.currentPage === pager.totalPages ? 'disabled' : ''}`}>
                    <a className="page-link" onClick={() => setPage(pager.totalPages)}>Last</a>
                </li>
            </ul>
        </nav>
    )
}

export default observer(ViewDesktop);
