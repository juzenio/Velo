import { describe, it, expect, beforeEach } from 'vitest';
import {
  useConfiguratorStore,
  calculateTotalPrice,
  calculateInstallment,
  formatPrice,
  CarConfiguration,
  Order,
} from './configuratorStore';

describe('configuratorStore - Funções Utilitárias', () => {
  describe('calculateTotalPrice', () => {
    it('deve calcular o preço base corretamente com configuração padrão', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'aero',
        optionals: [],
      };

      expect(calculateTotalPrice(config)).toBe(40000);
    });

    it('deve adicionar o valor da roda sport (+2000)', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'sport',
        optionals: [],
      };

      expect(calculateTotalPrice(config)).toBe(42000);
    });

    it('deve somar opcionais selecionados', () => {
      const configWithPark: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'aero',
        optionals: ['precision-park'],
      };
      expect(calculateTotalPrice(configWithPark)).toBe(45500);

      const configWithAll: CarConfiguration = {
        exteriorColor: 'midnight-black',
        interiorColor: 'deep-blue',
        wheelType: 'sport',
        optionals: ['precision-park', 'flux-capacitor'],
      };
      // Base (40000) + Sport (2000) + Precision Park (5500) + Flux Capacitor (5000) = 52500
      expect(calculateTotalPrice(configWithAll)).toBe(52500);
    });
  });

  describe('calculateInstallment', () => {
    it('deve calcular a parcela em 12x com juros compostos de 2% ao mês', () => {
      const total = 40000;
      const installment = calculateInstallment(total);

      // Com a fórmula Price: (40000 * 0.02 * (1.02)^12) / ((1.02)^12 - 1) ≈ 3782.38
      expect(installment).toBe(3782.38);
    });
  });

  describe('formatPrice', () => {
    it('deve formatar o valor como moeda BRL', () => {
      const formatted = formatPrice(40000);
      // Remove espaços não separáveis para validação flexível de formato pt-BR
      const normalized = formatted.replace(/\u00a0/g, ' ');
      expect(normalized).toContain('R$');
      expect(normalized).toContain('40.000,00');
    });
  });
});

describe('configuratorStore - Zustand Store', () => {
  const initialConfiguration: CarConfiguration = {
    exteriorColor: 'glacier-blue',
    interiorColor: 'carbon-black',
    wheelType: 'aero',
    optionals: [],
  };

  beforeEach(() => {
    // Reset do estado da store antes de cada teste
    useConfiguratorStore.setState({
      configuration: { ...initialConfiguration },
      viewMode: 'exterior',
      orders: [],
      currentUserEmail: null,
    });
  });

  it('deve inicializar com o estado padrão', () => {
    const state = useConfiguratorStore.getState();
    expect(state.configuration).toEqual(initialConfiguration);
    expect(state.viewMode).toBe('exterior');
    expect(state.orders).toEqual([]);
    expect(state.currentUserEmail).toBeNull();
  });

  it('deve alterar a cor externa e mudar viewMode para exterior', () => {
    const { setExteriorColor, setViewMode } = useConfiguratorStore.getState();
    
    setViewMode('interior');
    setExteriorColor('midnight-black');

    const state = useConfiguratorStore.getState();
    expect(state.configuration.exteriorColor).toBe('midnight-black');
    expect(state.viewMode).toBe('exterior');
  });

  it('deve alterar a cor interna e mudar viewMode para interior', () => {
    const { setInteriorColor } = useConfiguratorStore.getState();

    setInteriorColor('deep-blue');

    const state = useConfiguratorStore.getState();
    expect(state.configuration.interiorColor).toBe('deep-blue');
    expect(state.viewMode).toBe('interior');
  });

  it('deve alterar o tipo de roda', () => {
    const { setWheelType } = useConfiguratorStore.getState();

    setWheelType('sport');

    const state = useConfiguratorStore.getState();
    expect(state.configuration.wheelType).toBe('sport');
  });

  it('deve alternar a inclusão e remoção de opcionais', () => {
    const { toggleOptional } = useConfiguratorStore.getState();

    // Adiciona
    toggleOptional('precision-park');
    expect(useConfiguratorStore.getState().configuration.optionals).toEqual(['precision-park']);

    // Adiciona outro
    toggleOptional('flux-capacitor');
    expect(useConfiguratorStore.getState().configuration.optionals).toEqual([
      'precision-park',
      'flux-capacitor',
    ]);

    // Remove o primeiro
    toggleOptional('precision-park');
    expect(useConfiguratorStore.getState().configuration.optionals).toEqual(['flux-capacitor']);
  });

  it('deve adicionar pedidos e gerenciar login do usuário', () => {
    const { addOrder, login, logout, getUserOrders } = useConfiguratorStore.getState();

    const mockOrder: Order = {
      id: 'order-1',
      configuration: initialConfiguration,
      totalPrice: 40000,
      customer: {
        name: 'João',
        surname: 'Silva',
        email: 'joao@email.com',
        phone: '11999999999',
        cpf: '123.456.789-00',
        store: 'Loja Central',
      },
      paymentMethod: 'avista',
      status: 'APROVADO',
      createdAt: new Date().toISOString(),
    };

    addOrder(mockOrder);
    expect(useConfiguratorStore.getState().orders).toHaveLength(1);

    // Login com e-mail inexistente
    const loginFail = login('inexistente@email.com');
    expect(loginFail).toBe(false);
    expect(useConfiguratorStore.getState().currentUserEmail).toBeNull();
    expect(getUserOrders()).toEqual([]);

    // Login com e-mail existente
    const loginSuccess = login('joao@email.com');
    expect(loginSuccess).toBe(true);
    expect(useConfiguratorStore.getState().currentUserEmail).toBe('joao@email.com');
    expect(getUserOrders()).toEqual([mockOrder]);

    // Logout
    logout();
    expect(useConfiguratorStore.getState().currentUserEmail).toBeNull();
  });

  it('deve resetar a configuração para os valores padrões', () => {
    const { setExteriorColor, setWheelType, toggleOptional, resetConfiguration } =
      useConfiguratorStore.getState();

    setExteriorColor('midnight-black');
    setWheelType('sport');
    toggleOptional('precision-park');

    resetConfiguration();

    const state = useConfiguratorStore.getState();
    expect(state.configuration).toEqual(initialConfiguration);
  });
});
