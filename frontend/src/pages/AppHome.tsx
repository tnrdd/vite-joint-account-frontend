import { constant, wallet } from '@vite/vitejs';
import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Modal from '../components/Modal';
import TextInput, { TextInputRefObject } from '../components/TextInput';
import JointCointract from '../contracts/JointAccounts';
import { connect } from '../utils/globalContext';
import { useTitle } from '../utils/hooks';
import { validateInputs } from '../utils/misc';
import { toSmallestUnit } from '../utils/strings';
import { State } from '../utils/types';

type Props = State & {};

const AppHome = ({ i18n, vcInstance, callContract, setState }: Props) => {
	useTitle(i18n.app);
	const [searchParams] = useSearchParams();
	const [promptTxConfirmation, promptTxConfirmationSet] = useState(false);
	const [beneficiaryAddress, beneficiaryAddressSet] = useState(searchParams.get('address') || '');
	const [amount, amountSet] = useState(searchParams.get('amount') || '');
	const beneficiaryAddressRef = useRef<TextInputRefObject>();
	const amountRef = useRef<TextInputRefObject>();

	return (
		<div className="space-y-4 max-w-3xl mx-auto">
			<p className="text-2xl">Create a Joint Account</p>
			{!!promptTxConfirmation && (
				<Modal onClose={() => promptTxConfirmationSet(false)}>
					<p className="text-center text-lg font-semibold">
						{i18n.confirmTransactionOnYourViteWalletApp}
					</p>
				</Modal>
			)}
		</div>
	);
};

export default connect(AppHome);
