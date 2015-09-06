###How Knockout components fit into the MVVM pattern

When KnockoutJS first introduced (and recommended) components, I was eager to try out their functionality but soon stumbled upon what seemed more trouble than their perceived advantage. Now I had to manage a viewModel to which I didn't have access through Javascript, or couldn't retrieve any data from, and the method I previously used (making 'components' properties on their parent constructors) looked much simpler.

The KnockoutJS documentation doesn't provide a lot of cues as to what should be (1) the scale of a component (can it be any?), (2) the responsibilities it should handle, and (3) how it should be connected to/ communicate with the rest of the application. They allow re-use and modularity, but one ain't much with that information when you don't grasp the basics. The examples provided are basic at the very most and don't help much for a real-world example.

