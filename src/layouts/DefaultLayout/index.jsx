import PropTypes from 'prop-types';
import Header from "~/layouts/components/Header";
import Footer from "~/layouts/components/Footer";
import NavBar from "~/layouts/components/NavBar";
import styles from './DefaultLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header fixedHeader={true} />
            <NavBar />
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;