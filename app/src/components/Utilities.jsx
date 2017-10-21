//usage => <RadioOption label="Warcraft 2" value="wc2" />
function RadioOption() {
  return (
    <label>
      <input type="radio" value={props.value} name={props.name} />
      {props.label}
    </label>
  )
}