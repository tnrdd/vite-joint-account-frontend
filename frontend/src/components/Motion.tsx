import { useRef, useState, useEffect } from 'react';
import { XIcon } from '@heroicons/react/solid';
import Modal from './Modal';
import TextInput, { TextInputRefObject } from './TextInput';
import JointContract from '../contracts/JointAccounts';
import { connect } from '../utils/globalContext';
import { validateInputs } from '../utils/misc';
import { toSmallestUnit } from '../utils/strings';
import { NULL } from '../utils/constants';
import { State } from '../utils/types';
import { getPastEvents, getContractState } from '../utils/viteScripts';

type Props = State & {};
type Motion = {
	threshold?: string;
	id?: string;
	proposer?: string;
	to?: string;
	tokenId?: string;
	transferAmount?: string;
	votes?: string | null;
};

const Motion = ({
	i18n,
	viteApi,
	networkType,
	vcInstance,
	callContract,
	setState,
	accountId,
}: Props) => {
	const [promptTxConfirmation, promptTxConfirmationSet] = useState(false);
	const [motion, motionSet] = useState<Motion>({});
	const [tokenId, tokenIdSet] = useState('');
	const [amount, amountSet] = useState('');
	const [beneficiaryAddress, beneficiaryAddressSet] = useState('');
	const tokenIdRef = useRef<TextInputRefObject>();
	const amountRef = useRef<TextInputRefObject>();
	const beneficiaryAddressRef = useRef<TextInputRefObject>();

	const updateMotionStatus = async () => {
		const events = getPastEvents(
			viteApi,
			JointContract.address[networkType],
			JointContract.abi,
			'MotionCreated',
			{
				fromHeight: 0,
				toHeight: 0,
			}
		);
		const threshold = getContractState(
			viteApi,
			JointContract.address[networkType],
			JointContract.abi,
			'approvalThreshold',
			[accountId]
		);

		const results = await Promise.all([events, threshold]);
		const event = results[0].pop().returnValues;
		const active = await getContractState(
			viteApi,
			JointContract.address[networkType],
			JointContract.abi,
			'active',
			[accountId, event.motionId]
		);

		if (results[1]) {
			if (active && active[0] === '1') {
				const votes = await getContractState(
					viteApi,
					JointContract.address[networkType],
					JointContract.abi,
					'voteCount',
					[accountId, parseInt(event.motionId)]
				);
				motionSet({
					threshold: results[1][0],
					id: event.motionId,
					proposer: event.proposer,
					to: event.to,
					tokenId: event.tokenId,
					transferAmount: event.transferAmount,
					votes: votes && votes[0],
				});
			} else {
				motionSet({});
			}
		}
	};

	useEffect(() => {
		updateMotionStatus();

		viteApi
			.subscribe('newVmLog', {
				addressHeightRange: {
					[JointContract.address[networkType]]: {
						fromHeight: '0',
						toHeight: '0',
					},
				},
			})
			.then((event: any) => {
				event.on(() => {
					updateMotionStatus();
				});
			});
	}, []);

	return (
		<div className="flex flex-col gap-4">
			<p className="text-2xl">Active motion</p>
			{motion.id ? (
				<div>{`Transfer ${motion.transferAmount} of ${motion.tokenId} to ${motion.to} votes:${motion.votes}/${motion.threshold}`}</div>
			) : (
				<p>No active motion...</p>
			)}
			<p className="text-2xl">Create a new motion</p>
			<TextInput
				_ref={tokenIdRef}
				disabled={!vcInstance}
				label={i18n.tokenId}
				value={tokenId}
				onUserInput={(v) => tokenIdSet(v.trim())}
			/>
			<TextInput
				numeric
				_ref={amountRef}
				disabled={!vcInstance}
				label={i18n.amount}
				value={amount}
				maxDecimals={18}
				onUserInput={(v) => amountSet(v)}
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
				_ref={beneficiaryAddressRef}
				disabled={!vcInstance}
				label={i18n.beneficiaryAddress}
				value={beneficiaryAddress}
				onUserInput={(v) => beneficiaryAddressSet(v.trim())}
			/>
			<button
				className={`${
					vcInstance ? 'bg-skin-medlight brightness-button' : 'bg-gray-400'
				} h-8 px-3 rounded-md font-semibold text-white shadow`}
				disabled={!vcInstance}
				onClick={async () => {
					if (validateInputs([amountRef])) {
						const contractAddress = JointContract.address[networkType];
						const tokenInfo = await viteApi.request('contract_getTokenInfoById', tokenId);
						promptTxConfirmationSet(true);
						const block = await callContract(JointContract, 'createTransferMotion', [
							accountId,
							tokenId,
							toSmallestUnit(amount, tokenInfo.decimals),
							beneficiaryAddress,
							NULL,
						]);
						setState({
							toast: i18n.transactionConfirmed,
						});
						tokenIdSet('');
						amountSet('');
						beneficiaryAddressSet('');
						promptTxConfirmationSet(false);
					}
				}}
			>
				{i18n.createMotion}
			</button>
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

export default connect(Motion);