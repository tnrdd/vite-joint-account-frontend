import { useRef, useState } from 'react';
import { XIcon } from '@heroicons/react/solid';
import Modal from './Modal';
import TextInput, { TextInputRefObject } from './TextInput';
import JointContract from '../contracts/JointAccounts';
import { connect } from '../utils/globalContext';
import { validateInputs } from '../utils/misc';
import { toSmallestUnit } from '../utils/strings';
import { State } from '../utils/types';
import { getPastEvents } from '../utils/viteScripts';

type Props = State & {};

const NewAccount = ({ i18n, viteApi, networkType, vcInstance, callContract, setState }: Props) => {
	const [promptTxConfirmation, promptTxConfirmationSet] = useState(false);
	const [threshold, thresholdSet] = useState('');
	const [memberAddress, memberAddressSet] = useState('');
	const [members, membersSet] = useState<string[]>([]);
	const memberAddressRef = useRef<TextInputRefObject>();
	const thresholdRef = useRef<TextInputRefObject>();

	return (
		<>
			<p className="text-2xl">Create a Joint Account</p>
			<TextInput
				numeric
				_ref={thresholdRef}
				disabled={!vcInstance}
				label={i18n.threshold}
				value={threshold}
				maxDecimals={18}
				onUserInput={(v) => thresholdSet(v)}
				getIssue={(v) => {
					if (+v <= 0) {
						return i18n.amountMustBePositive;
					}
					if (+v % 1 !== 0) {
						return i18n.positiveIntegersOnly;
					}
				}}
			/>
			<TextInput
				_ref={memberAddressRef}
				disabled={!vcInstance}
				label={i18n.addMember}
				value={memberAddress}
				onUserInput={(v) => memberAddressSet(v.trim())}
			/>
			<div className="flex flex-col gap-4">
				<button
					className={`${
						vcInstance ? 'bg-black brightness-button' : 'bg-gray-400'
					} h-8 px-3 rounded-md font-semibold text-white shadow`}
					disabled={!vcInstance}
					onClick={() => {
						if (validateInputs([memberAddressRef])) {
							memberAddressSet('');
							membersSet([...members, memberAddress]);
						}
					}}
				>
					{i18n.addMember}
				</button>
				<button
					className={`${
						vcInstance ? 'bg-skin-medlight brightness-button' : 'bg-gray-400'
					} h-8 px-3 rounded-md font-semibold text-white shadow`}
					disabled={!vcInstance}
					onClick={async () => {
						if (validateInputs([thresholdRef])) {
							const contractAddress = JointContract.address[networkType];
							promptTxConfirmationSet(true);
							await callContract(JointContract, 'createAccount', [
								[vcInstance?.accounts[0], ...members],
								threshold,
								0,
								0,
							]);
							let logs = await viteApi.request('ledger_getLatestAccountBlock', contractAddress);
							const events = await getPastEvents(
								viteApi,
								contractAddress,
								JointContract.abi,
								'AccountCreated',
								{
									fromHeight: logs.height,
									toHeight: logs.height,
								}
							);

							const event = events.filter(
								(item) => item.returnValues['1'] === vcInstance?.accounts[0]
							)[0];
							setState({
								accountId: event.returnValues.accountId,
								toast: i18n.transactionConfirmed,
							});
							thresholdSet('');
							promptTxConfirmationSet(false);
						}
					}}
				>
					{i18n.createAccount}
				</button>
			</div>
			{members.length > 0 && (
				<div className="bg-white rounded-md p-8">
					<span className="font-bold">Members</span>
					{members.map((member, i) => {
						return (
							<div
								key={i}
								className="w-[calc(100%-1.2rem)] border-b-2 border-gray-300 flex justify-between"
							>
								<span className="break-all">{member}</span>
								<XIcon
									className="h-5 w-5 text-red-500 cursor-pointer shrink-0"
									onClick={() => membersSet(members.slice(0, -1))}
								/>
							</div>
						);
					})}
				</div>
			)}
			{!!promptTxConfirmation && (
				<Modal onClose={() => promptTxConfirmationSet(false)}>
					<p className="text-center text-lg font-semibold">
						{i18n.confirmTransactionOnYourViteWalletApp}
					</p>
				</Modal>
			)}
		</>
	);
};

export default connect(NewAccount);
