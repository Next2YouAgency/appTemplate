import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs>

      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Painel",
          tabBarIcon: ({ focused, color, size }) => {
            if (focused) {
              return <FontAwesome name="tags" color={color} size={size} />
            }

            return <FontAwesome name="tag" color={color} size={size} />
          }
        }}
      />

      <Tabs.Screen
        name="listas"
        options={{
          headerShown: false,
          title: "Listas",
          tabBarIcon: ({ focused, color, size }) => {
            if (focused) {
              return <FontAwesome name="list" color={color} size={size} />
            }

            return <FontAwesome name="list-ul" color={color} size={size} />
          }
        }}
      />

      <Tabs.Screen
        name="mercados"
        options={{
          headerShown: false,
          title: "Mercados",
          tabBarIcon: ({ focused, color, size }) => {
            if (focused) {
              return <FontAwesome name="cart-plus" color={color} size={size} />
            }

            return <FontAwesome name="cart-arrow-down" color={color} size={size} />
          }
        }}
      />

      <Tabs.Screen
        name="produtos"
        options={{
          headerShown: false,
          title: "Produtos",
          tabBarIcon: ({ focused, color, size }) => {
            if (focused) {
              return <FontAwesome name="product-hunt" color={color} size={size} />
            }

            return <FontAwesome name="product-hunt" color={color} size={size} />
          }
        }}
      />

      <Tabs.Screen
        name='settings'
        options={{
          headerShown: false,
          title: "Config",
          tabBarIcon: ({ focused, color, size }) => {
            if (focused) {
              return <FontAwesome name="cogs" color={color} size={size} />
            }
            return <FontAwesome name="cog" color={color} size={size} />
          }
        }}
      />
    </Tabs>
  )
}