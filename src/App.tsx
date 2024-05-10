import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Button,
  useDisclosure,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import ModalComp from './components/ModalComp';

interface Product {
  product_id: number;
  product_name: string;
  product_amount: number;
  product_price: number;
}

const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useState<Product[]>([]); 
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);


  const isMobile = useBreakpointValue({
    base: true,
    lg: false,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://api-gerenciamento-de-estoque.vercel.app/api/product/");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleRemove = async (productId: number) => {
    try {
      await axios.delete(`https://api-gerenciamento-de-estoque.vercel.app/api/data/${productId}/`);
      setProducts(products.filter(product => product.product_id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    onOpen();
  };

  const handleOpenModal = () => {
    setProductToEdit(null);
    onOpen();
  };


  const productToEditOrDefault = productToEdit || { product_id: 0, product_name: "", product_amount: 0, product_price: 0 };

return (
  <Flex
    h="100vh"
    align="center"
    justify="center"
    fontSize="20px"
    fontFamily="poppins"
  >
    <Box maxW={800} w="100%" h="100vh" py={10} px={2}>
      <Button colorScheme="blue" onClick={handleOpenModal}>
        NOVO PRODUTO
      </Button>

      <Box overflowY="auto" height="100%">
        <Table mt="7">
          <Thead>
            <Tr>
            <Th maxW={isMobile ? 5 : 100} fontSize="20px">
                ID
              </Th>
              <Th maxW={isMobile ? 5 : 100} fontSize="20px">
                Nome
              </Th>
              <Th maxW={isMobile ? 5 : 100} fontSize="20px">
                Quantidade
              </Th>
              <Th maxW={isMobile ? 5 : 100} fontSize="20px">
                Preço
              </Th>
              <Th p={0}></Th>
              <Th p={0}></Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map(({ product_id, product_name, product_amount, product_price }) => (
              <Tr key={product_id} cursor="pointer" _hover={{ bg: "gray.100" }}>
                <Td maxW={isMobile ? 5 : 100}>{product_id}</Td>
                <Td maxW={isMobile ? 5 : 100}>{product_name}</Td>
                <Td maxW={isMobile ? 5 : 100}>{product_amount}</Td>
                <Td maxW={isMobile ? 5 : 100}>{product_price}</Td>
                <Td p={0}>
                  <EditIcon
                    fontSize={20}
                    onClick={() => handleEdit({ product_id, product_name, product_amount, product_price })}
                  />
                </Td>
                <Td p={0}>
                  <DeleteIcon
                    fontSize={20}
                    onClick={() => handleRemove(product_id)} 
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
    {isOpen && (
      <ModalComp
        setProductToEdit={setProductToEdit} 
        isOpen={isOpen}
        onClose={onClose}
        product={productToEditOrDefault}
        setProducts={setProducts}
      />
    )}
  </Flex>
);
}
export default App;
