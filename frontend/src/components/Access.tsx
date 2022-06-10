import { useRef, useState } from 'react';
import { XIcon } from '@heroicons/react/solid';
import Modal from './Modal';
import TextInput, { TextInputRefObject } from './TextInput';
import JointContract from '../contracts/JointAccounts';
import { connect } from '../utils/globalContext';
import { validateInputs } from '../utils/misc';
import { toSmallestUnit } from '../utils/strings';
import { State } from '../utils/types';
import { getContractState } from '../utils/viteScripts';

type Props = State & {};

const Access = ({ i18n, viteApi, networkType, vcInstance, callContract, setState }: Props) => {
	const [accountId, accountIdSet] = useState('');
	const accountIdRef = useRef<TextInputRefObject>();

	return (
		<div className="flex flex-col gap-4">
			<p className="text-2xl">Access your Joint Account</p>
			<TextInput
				numeric
				_ref={accountIdRef}
				disabled={!vcInstance}
				label={i18n.insertAccountId}
				maxDecimals={18}
				value={accountId}
				onUserInput={(v) => accountIdSet(v)}
				getIssue={(v) => {
					if (+v <= 0) {
						return i18n.amountMustBePositive;
					}
					if (+v % 1 !== 0) {
						return i18n.positiveIntegersOnly;
					}
				}}
			/>
			<button
				className={`${
					vcInstance ? 'bg-skin-medlight brightness-button' : 'bg-gray-400'
				} h-8 px-3 rounded-md font-semibold text-white shadow`}
				disabled={!vcInstance}
				onClick={async () => {
					if (validateInputs([accountIdRef])) {
						const contractAddress = JointContract.address[networkType];
						const exists = await getContractState(
							viteApi,
							JointContract.address[networkType],
							JointContract.abi,
							'accountExists',
							[accountId]
						);

						console.log(exists);
						if (exists && exists[0] === '0') {
							setState({
								toast: i18n.invalidAccountId,
							});
						} else {
							setState({
								accountId: +accountId,
							});
						}
						accountIdSet('');
					}
				}}
			>
				{i18n.access}
			</button>
		</div>
	);
};

export default connect(Access);
