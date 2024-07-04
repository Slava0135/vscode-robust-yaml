using Robust.Shared.GameStates;

namespace Content.Shared.Sound.Components;

/// <summary>
/// Simple sound emitter that emits sound on UseInHand
/// </summary>
[RegisterComponent]
public sealed partial class EmitSoundOnUseComponent : BaseEmitSoundComponent
{
    [DataField("handle")]
    public bool Handled = true;
}
