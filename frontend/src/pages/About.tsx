import { connect } from '../utils/globalContext';
import { useTitle } from '../utils/hooks';
import { State } from '../utils/types';

type Props = State & {};

const About = ({ i18n }: Props) => {
	useTitle(i18n.about);
	return (
		<div className="space-y-4 max-w-3xl mx-auto">
			<h1 className="text-3xl mb-5">What's a Joint Account?</h1>
			<span>
				A Joint Account is an account shared by different members, it improves the security of the
				funds deposited in it because to move them a minimum number of members must agree.
				<br />
				You can create a Joint Account and use it in a few easy steps.
			</span>
			<div>
				<div>
					<div className="flex items-center">
						<span className="flex justify-center items-center w-10 h-10 ml-0.5 bg-skin-medlight rounded-full text-white text-2xl font-bold">
							1
						</span>
						<span className="ml-5 text-xl font-bold">Create an account</span>
					</div>
					<div className="ml-5 pl-10 border-l-4 border-skin-line-divider">
						Under the 'New Account' tab you can choose how many votes will be needed to move the
						account funds via the 'Threshold' field. You can add how many members you wish by
						filling out the 'Member Address' field and pressing the 'Add member' button. When you
						are done press the 'Create Joint Account' button to create your account.
					</div>
				</div>
				<div>
					<div className="flex items-center">
						<span className="flex justify-center items-center w-10 h-10 ml-0.5 bg-skin-medlight rounded-full text-white text-2xl font-bold">
							2
						</span>
						<span className="ml-5 text-xl font-bold">Deposit funds</span>
					</div>
					<div className="ml-5 pl-10 border-l-4 border-skin-line-divider">
						You can deposit funds to the account from the 'Deposit' tab, choose the token you
						want to deposit by filling out the 'Token ID' field, token IDs start with 'tti_'
						followed by letters and numbers. Then choose the amount of tokens you want to deposit
						via the 'Amount' field and press the 'Deposit' button to make a deposit.
					</div>
				</div>
				<div>
					<div className="flex items-center">
						<span className="flex justify-center items-center w-10 h-10 ml-0.5 bg-skin-medlight rounded-full text-white text-2xl font-bold">
							3
						</span>
						<span className="ml-5 text-xl font-bold">Create a motion</span>
					</div>
					<div className="ml-5 pl-10 border-l-4 border-skin-line-divider">
						To move funds to a different address you can create a motion from the 'Motion' tab.
						Choose the token and the amount you want to move by filling out the 'Token ID' and
						'Amount' fields, then enter the address you want to transfer funds to in the
						'Beneficiary address' field and press the 'Create motion' button.
					</div>
				</div>
				<div>
					<div className="flex items-center">
						<span className="flex justify-center items-center w-10 h-10 ml-0.5 bg-skin-medlight rounded-full text-white text-2xl font-bold">
							4
						</span>
						<span className="ml-5 text-xl font-bold">Transfer funds</span>
					</div>
					<div className="ml-5 pl-10">
						When there is an active motion it will be displayed under the 'Motion' tab, if you are
						the creator of the motion your vote is already counted. Other members can vote in favor
						of the motion by pressing the 'Vote' button or can vote against by pressing the
						'Cancel' button. If one member vote against it the motion will be canceled, while if the
						threshold of votes is reached the transaction will take place.
					</div>
				</div>
			</div>
		</div>
	);
};

export default connect(About);
