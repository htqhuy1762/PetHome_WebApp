import PropTypes from 'prop-types';
import Header from '~/layouts/components/Header';
import Footer from '~/layouts/components/Footer';
import styles from './HeaderFooter.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function HeaderFooter({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header fixedHeader={false}/>
            <div className={cx('container')}>
                <div className={cx('container')}>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

HeaderFooter.propTypes = {
    children: PropTypes.node.isRequired,
};

export default HeaderFooter;