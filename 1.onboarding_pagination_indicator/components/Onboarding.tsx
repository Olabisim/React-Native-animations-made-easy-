
import { StyleSheet, View, Text, Pressable, PressableProps } from "react-native";
import Animated, { AnimatedProps, FadeInDown, FadeInLeft, FadeOutLeft, FadeOutUp, interpolateColor, LinearTransition, SharedValue, useAnimatedStyle, useDerivedValue, withSpring } from "react-native-reanimated";


// add more capabalities so that it can have layout animations exiting and entering animaitons
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

// constants
const _spacing = 8;
const _buttonHeight = 42;
const _layoutTransition = LinearTransition.springify().damping(80).stiffness(200);
const _dotContainer = 24;
const _dotSize = _dotContainer / 3;

const _activeDot = '#fff'
const _inactiveDot = "#aaa"


function Button({children, style, ...rest}: AnimatedProps<PressableProps>) {
    return <AnimatedPressable style={[
        {
            height: _buttonHeight,
            borderRadius: _buttonHeight / 2,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: _spacing * 2,
        },
        style,
        ]} 
        entering={FadeInLeft.springify().damping(80).stiffness(200)}
        exiting={FadeOutLeft.springify().damping(80).stiffness(200)}
        {...rest}
        layout={_layoutTransition}
        >
        {children}
    </AnimatedPressable>
}

function Dot({index, animation}: {index:number, animation: SharedValue<number>}) {

    const stylez = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                animation.value,
                [index - 1, index, index + 1],
                [_inactiveDot, _activeDot, _activeDot]
            )
        }
    })

    return (
    <View 
        style={{ width: _dotContainer, height: _dotContainer, justifyContent: 'center', alignItems: 'center'}}
    >
        <Animated.View 
            style={[stylez, {
                width: _dotSize,
                height: _dotSize,
                borderRadius: _dotSize
            }]}>

        </Animated.View>
    </View>
    )
}


function PaginationIndicator({animation}: {animation: SharedValue<number>}) {

    const stylez = useAnimatedStyle(() => {
        return {
            width: _dotContainer + _dotContainer * animation.value
        }
    })

    return <Animated.View 
        style={[{
            backgroundColor: '#29BE56',
            height: _dotContainer,
            width: _dotContainer,
            borderRadius: _dotContainer,
            position: 'absolute',
            left: 0,
            top: 0
        },
        stylez
        ]}
    />
}


export function Pagination({total, selectedIndex}: {total: number, selectedIndex: number}) {

    const animation = useDerivedValue(() => {
        // whenever the index postion is changed apply a spring animation between the old and the new index
        return withSpring(selectedIndex, {
            damping: 80,
            stiffness: 200
        })
    })

    return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={{flexDirection: 'row'}}> 
                <PaginationIndicator animation={animation} />
                {[...Array(total).keys()].map(i => (
                    <Dot key={`dot-${i}`} index={i} animation={animation} />
                ))}
            </View>
        </View>
    )
}

export function Onboarding ({total, selectedIndex, onIndexChange}: {total: number, selectedIndex: number, onIndexChange: (index:number) => void }) {
    return (
        <View style={{padding: _spacing, gap: _spacing}}>
            <Pagination
                total={total}
                selectedIndex={selectedIndex}
            />
            {/* <Text>Onboarding {selectedIndex}</Text> */}
            <View style={{flexDirection: 'row', gap: _spacing}}>

                {
                    selectedIndex > 0 && (
                    <Button
                        style={{
                            backgroundColor: '#ddd'
                        }}

                        onPress={() =>  {
                            onIndexChange(selectedIndex - 1)
                        }}
                    >
                        <Text> Back</Text>
                    </Button>
                    )
                }

                <Button
                    style={{
                        backgroundColor: '#036BFB',
                        flex: 1
                    }}
                    onPress={() => {
                        if(selectedIndex === total - 1) {
                         return;   
                        }
                        onIndexChange(selectedIndex + 1)
                    }}
                >
                    {selectedIndex === total - 1 ? (
                        <Animated.Text 
                            style={{color: '#fff'}} 
                            entering={FadeInDown.springify().damping(80).stiffness(200)}
                            exiting={FadeOutUp.springify().damping(80).stiffness(200)}
                            key="finish"
                            // layout={_layoutTransition}
                        >Finish</Animated.Text>
                    )
                    :
                    (
                        <Animated.Text style={{color: '#fff'}} 
                            key="continue"
                            entering={FadeInDown.springify().damping(80).stiffness(200)}
                            exiting={FadeOutUp.springify().damping(80).stiffness(200)}
                            layout={_layoutTransition}
                        >Continue</Animated.Text>
                    )}
                </Button>
            </View>
        </View>
    )
}
