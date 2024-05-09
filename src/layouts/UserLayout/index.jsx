import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './UserLayout.module.scss';
import Header from '~/layouts/components/Header';
import Footer from '~/layouts/components/Footer';
import SidebarUser from '~/layouts/components/SidebarUser';

const cx = classNames.bind(styles);

function UserLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header fixedHeader={false} />
            <div className={cx('container')}>
                <SidebarUser />
                <div className={cx('content')}>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

UserLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default UserLayout;
