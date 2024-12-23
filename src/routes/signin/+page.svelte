<!-- <pre>
{JSON.stringify($form, null, " ")}
</pre> -->
<script>
	import './signin.sass';
	import { useForm, validators, HintGroup, Hint, required } from "svelte-use-form";
	const form = useForm();
	const username_pattern = /^[\w\d\-.]{3,}$/g;
	function username(text) {
		if(text.match(username_pattern))
			return null;
		else
			return {
				username: "Invalid",
			};
	}
</script>
<form use:form method="POST">
	<h1 class="w3-container w3-center">signin</h1>
	<div>
		<label labely class="w3-sans w3-large" for="username">
			username:
		</label>
		<input class="w3-input w3-margin-top w3-margin-bottom" type="username" name="username"  use:validators={[required, username]} />
		<div class="hint">
			<HintGroup for="username">
				<Hint on="required">This is a mandatory field</Hint>
				<Hint on="username" hideWhenRequired>
					Username is not valid. Should match
					<code>
						{username_pattern}
					</code>

				</Hint>
			</HintGroup>
		</div>
	</div>
	<div>
		<label labely class="w3-sans w3-large" for="password">
			password:
		</label>
		<input class="w3-input w3-margin-top w3-margin-bottom" type="password" name="password" id="password" use:validators={[required]} />
		<div class="hint">
			<Hint for="password" on="required">This is a mandatory field</Hint>
		</div>
	</div>
	<div style="display: flex;justify-content: space-between;">
		<button type="submit" class="w3-inline w3-button w3-dark-gray {$form.valid?'':'w3-disabled'}">signin &gt;</button>
		<p>Don't have an account,
			<a href="/signup" class="w3-text-cyan">
				signup?
			</a>
		</p>
	</div>
</form>