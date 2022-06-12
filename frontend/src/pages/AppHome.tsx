import NewAccount from '../components/NewAccount';
import Access from '../components/Access';
import Deposit from '../components/Deposit';
import MotionView from '../components/MotionView';
import TabNavigation from '../components/TabNavigation';
import { connect } from '../utils/globalContext';
import { useTitle } from '../utils/hooks';
import { State } from '../utils/types';

type Props = State & {};

const AppHome = ({
	i18n,
	viteApi,
	networkType,
	vcInstance,
	callContract,
	setState,
	accountId,
	activeTab,
}: Props) => {
	useTitle(i18n.app);

	return (
		<div className="space-y-4 max-w-3xl mx-auto">
			{!vcInstance && (
				<p className="text-center font-bold">Please connect your wallet to use the app</p>
			)}
			{vcInstance && !accountId && (
				<TabNavigation tabNames={['New Account', 'Access Account']} defaultTab={'New Account'} />
			)}
			{vcInstance && accountId && (
				<TabNavigation tabNames={['Deposit', 'Motion']} defaultTab={'Deposit'} />
			)}
			{!accountId && vcInstance && activeTab === 'New Account' && <NewAccount />}
			{!accountId && vcInstance && activeTab === 'Access Account' && <Access />}
			{accountId && <div className="flex justify-center font-bold">Account ID: {accountId}</div>}
			{accountId && activeTab === 'Deposit' && <Deposit />}
			{accountId && activeTab === 'Motion' && <MotionView />}
		</div>
	);
};

export default connect(AppHome);
