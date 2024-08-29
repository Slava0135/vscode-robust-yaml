using Robust.Shared.Serialization.TypeSerializers.Implementations.Custom.Prototype.List;

namespace Content.Client.Guidebook.Components;

/// <summary>
/// This component stores a reference to a guidebook that contains information relevant to this entity.
/// </summary>
[RegisterComponent]
[Access(typeof(GuidebookSystem))]
public sealed partial class GuideHelpComponent : Component
{
    /// <summary>
    /// What guides to include show when opening the guidebook. The first entry will be used to select the currently
    /// selected guidebook.
    /// </summary>
    [DataField("guides", customTypeSerializer: typeof(PrototypeIdListSerializer<GuideEntryPrototype>), required: true)]
    [ViewVariables]
    public List<string> Guides = new();
}
